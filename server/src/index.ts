import { PacketReceived, TypePacket } from "./components/PacketReceived";

import { ACK } from "./helpers/ACK";
import { ComandoInterface } from "./interfaces/comandoInterface";
import { ComandosRepository } from "./components/ComandosRepository";
import { Gateway } from "./components/Gateway";
import { IPEndPoint } from "./interfaces/ipendpoint";
import { appendFileSync } from "fs";
import mongoose from "mongoose";

var udp = require("dgram");
var server = udp.createSocket("udp4");

server.on("error", (error: string) => {
  console.log("Error: " + error);
  server.close();
});

server.on("message", async (msg: Buffer, info: IPEndPoint) => {
  try {
    let message = msg.toString("utf8");
    message = message.replace(/[\\n]|[\n]|["]/gm, "");

    let gateway = new Gateway();

    await gateway.SavePacket(message, server, info);

    let mensagemAck = new ACK().GetMensagemAck(message);
    server.send(
      Buffer.from(mensagemAck),
      info.port,
      info.address,
      function (error: any) {
        if (error) {
          console.log(error);
          server.close();
        } else {
          console.log("Resposta Enviada");
        }
      }
    );
  } catch (error) {
    console.log("Error: ", error);
  }
});

server.on("listening", () => {
  var address = server.address();
  var port = address.port;
  mongoose
    .connect(
      "mongodb+srv://pedrodcs:opb5220@teste.jz69l.mongodb.net/gerenciador"
    )
    .then(() => {
      console.log("Database Conected");
    });

  console.log("Servidor Na Porta " + port);
});

server.bind(2222);
