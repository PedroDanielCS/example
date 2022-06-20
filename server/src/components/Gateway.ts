import { PacketReceived, TypePacket } from "./PacketReceived";

import { ComandoInterface } from "../interfaces/comandoInterface";
import { ComandosRepository } from "./ComandosRepository";
import { IPEndPoint } from "../interfaces/ipendpoint";
import { Packet } from "../schemas/packetSchema";
import { Position } from "./Position";
import { PositionsSinotico } from "../schemas/positionsSinoticoSchema";
import { PositionsSinoticoInterface } from "../interfaces/PositionsSinotico";
import { TypeSUC } from "../enums/TypeSUC";
import { ValidatePacket } from "./ValidatePacket";
import { appendFileSync } from "fs";

const data = require("../../mockDtListOrgUnits.json");

export class Gateway {
  constructor() {}

  async SavePacket(message: string, serve: any, ipendpoint: IPEndPoint) {
    try {
      console.log("SavePacket - Inicio");
      let validatePacket = new ValidatePacket();
      if (message.length > 0 && message != null) {
        if (validatePacket.IsRUV(message)) {
          if (validatePacket.IsValid(message)) {
            console.log(`${new Date()} - Pacote Position: ${message} `);

            let packet = new PacketReceived(message, data);

            if (
              packet.TypePacket == TypePacket.Position &&
              packet.IsValidDateTime &&
              packet.Equipment != null &&
              packet.Equipment.assetID != null &&
              packet.Equipment.assetID.length > 0
            ) {
              const savePacket = new Packet({
                UnitId: packet.UnitId,
                AddedAtUtc: new Date(),
                AssetId: parseInt(packet.Equipment.assetID),
                OrgId: packet.Equipment.orgid,
                Database: packet.Equipment.Databasename,
                Mensage: packet.Message,
                Pending: true,
                Password: packet.Equipment.password,
                Username: packet.Equipment.username,
                ServerName: packet.Equipment.serverName,
              });
              try {
                console.log("Init - PacketRepository.Instance.Save(packet) ");
                await savePacket.save();
                console.log("Finish - PacketRepository.Instance.Save(packet) ");
              } catch (error) {
                console.log("Instance: ", error);
              }

              if (parseInt(packet.Equipment.sinotico)) {
                if (validatePacket.GetTypeSUC(message) == TypeSUC.SUC01) {
                  console.log("Equipment sinotico - Init");
                  let position = new Position(message);

                  let positionsSinotico: PositionsSinoticoInterface = {
                    AssetId: savePacket.AssetId,
                    OrgId: savePacket.OrgId,
                    Lat: position.latitude.toString().replace(",", "."),
                    Lng: position.longitude.toString().replace(",", "."),
                    speed: position.SpeedKilometresPerHour,
                    timestamp: position.Timestamp,
                    UnitId: savePacket.UnitId,
                    DriverId: position.DriverId.toString(),
                    Pending: true,
                    Odometer: position.Odometer,
                    IgnitionOn: position.IgnitionOn,
                    Orientation: position.Orientation,
                  };

                  await PositionsSinotico.create(positionsSinotico);
                  console.log("Equipment sinotico - Fim");
                }
              }
            }
            //trabalhar melhor nisso aqui
            appendFileSync("../fila.json", JSON.stringify(packet));
            appendFileSync("../fila.json", "\n");

            this.SendComando(message, serve, ipendpoint);
          } else {
            console.log("Invalid Packet: ", message);
          }
        } else {
          console.log(`${new Date()} - Pacote Geral: ${message} `);
          await this.SendComando(message, serve, ipendpoint);
        }
      }

      console.log("SavePacket - Fim");
    } catch (error) {
      console.log("SavePacket: ", error);
    }
  }

  async SendComando(message: string, serve: any, ipendpoint: IPEndPoint) {
    console.log("SendComando - Inicio");
    let packet: PacketReceived;
    try {
      packet = new PacketReceived(message, data);
    } catch (error) {
      console.log(error);
      return;
    }

    if (
      packet.Equipment != null &&
      packet.Equipment.assetID != null &&
      packet.Equipment.assetID.length > 0
    ) {
      if (packet.TypePacket == TypePacket.General) {
        let comandoRepository = new ComandosRepository();
        console.log("TypePacket.General");

        let comando: ComandoInterface =
          await comandoRepository.GetComandoPendente(
            packet.UnitId,
            packet.MessageId
          );

        if (
          comando != null &&
          comando.QtdComandos >= 0 &&
          comando.NroMsg == packet.MessageId
        ) {
          console.log("Tratando o Comando - Inicio");

          let status: number = 2;
          if (packet.Message.includes("ERRO")) status = 3;

          comando.Status = status;
          comando.MensagemResp = comando.MensagemResp.replace(
            /[\\n]|[\n]|["]/gm,
            ""
          );
          comando.QtdComandos--;

          await comandoRepository.updateComando(comando);
          console.log("Tratando o Comando - Fim");
        }
      }
      await this.enviarComando(packet, serve, ipendpoint);
      console.log("SendComando - Fim");
    }
  }

  async enviarComando(
    packet: PacketReceived,
    serve: any,
    ipendpoint: IPEndPoint
  ) {
    console.log("enviarComando - Inicio");

    let comandoRepository = new ComandosRepository();
    let comando: ComandoInterface = await comandoRepository.GetComandoPendente2(
      packet.UnitId
    );

    if (comando != null) {
      console.log("Enviar Comando not Null");

      if (comando.NroMsg == packet.MessageId) {
        console.log(
          `${new Date()}  - SendComand - Finalizado: ${comando.Mensagem} `
        );
        let status: number = 2;
        if (packet.Message.includes("ERRO")) status = 3;
        comando.Status = status;
        comando.MensagemResp = comando.MensagemResp.replace(
          /[\\n]|[\n]|["]/gm,
          ""
        );
        await comandoRepository.updateComando(comando);
      }
      if (comando.Status == 2 || comando.Status == 3)
        comando = await comandoRepository.GetComandoPendente2(packet.UnitId);

      //tive que colocar esse va==IF aqui porque pode dar erro
      if (comando != null) {
        console.log(`${new Date()}  - SendComand : ${comando.Mensagem} `);

        serve.send(
          Buffer.from(comando.Mensagem),
          ipendpoint.port,
          ipendpoint.address,
          function (error: any) {
            if (error) {
              console.log(error);
              serve.close();
            } else {
              console.log("Resposta Enviada");
            }
          }
        );
        comando.Status = 1;
        comando.DataSend = new Date();
        comando.QtdReenvio += 1;
        await comandoRepository.updateComando(comando);
      }
      console.log("enviarComando - Fim");
    }
  }
}
