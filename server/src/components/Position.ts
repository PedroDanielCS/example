import { IsNullOrEmpty, TrimStart } from "../helpers/auxFunctions";

import { Evento } from "../enums/Evento";
import { TipoEstruturaDados } from "../enums/TipoEstruturaDados";
import { TypeSUC } from "../enums/TypeSUC";
import { ValidatePacket } from "./ValidatePacket";

export class Position {
  TipoEstruturaDados!: TipoEstruturaDados;

  LeituraEvento: string | undefined;

  IdEvento!: Evento;
  UnitId!: string;
  DriverId!: number;

  assetId!: string;

  Timestamp!: Date;
  latitude!: number;
  longitude!: number;
  SpeedKilometresPerHour!: number;
  Orientation!: number;
  IgnitionOn!: number;
  Odometer!: number;
  IsAvl!: number;
  Rpm!: number;
  Consumo!: number;
  ValueEvent!: number;
  orgID!: number;
  DatabaseName!: string;
  UsernameDatabase!: string;
  PasswordDatabase!: string;

  ServerName!: string;
  PositionID!: number;
  dataSplit!: Array<string>;

  IsTrack!: number;

  constructor(message: string) {
    if (!message.includes("RUV")) return;

    this.IsTrack = this.getIsTrack(message);

    if (IsNullOrEmpty(message)) {
      let indexVirgula1 = message.indexOf(",");

      //Tipo de Estrutura de Dados
      this.TipoEstruturaDados = parseInt(message.substring(4, 6));

      //Extrair o tipo da mensagem
      this.LeituraEvento = message.substring(1, 4);
      this.IdEvento = parseInt(message.substring(6, indexVirgula1));

      this.getUnitId(message);

      this.dataSplit = message
        .substring(indexVirgula1 + 1, message.indexOf(";"))
        .split(",");

      if (
        this.dataSplit[0].length > 10 &&
        parseInt(this.dataSplit[0].substring(0, 2)) < 32
      ) {
        this.resolveDataSplit(0);
      } else if (this.dataSplit.length > 6) {
        this.resolveDataSplit(4);
      } else if (this.dataSplit[1].length > 20) {
        this.resolveDataSplit(1);
      }
    }
  }

  private getIsTrack(message: string): number {
    let typeSUC: TypeSUC = new ValidatePacket().GetTypeSUC(message);

    if (typeSUC == TypeSUC.SUC01) return 1;
    else return 0;
  }

  private getUnitId(message: string) {
    let indexID = message.indexOf("ID");
    if (message.indexOf("#") != -1) {
      this.UnitId = message
        .substring(indexID + 3, indexID + 3 + 5)
        .replace(";", "");
    } else {
      this.UnitId = message
        .substring(indexID + 3, indexID + 3 + 4)
        .replace(";", "");
    }

    //Nova validação para atualização do campo UnitId para Varchar(4)
    let IsIntNum;
    if (parseInt(this.UnitId)) {
      IsIntNum = parseInt(this.UnitId);
      if (IsIntNum != 0) this.UnitId = TrimStart(this.UnitId, "0");
      else this.UnitId = IsIntNum.toString();
    }
  }

  private getOdometer(data: string) {
    if (data != "" && parseInt(data)) this.Odometer = parseInt(data);
    else this.Odometer = 0;
  }

  private getLatLon(data: string) {
    this.latitude = parseFloat(data.substring(12, 20)) / 100000;
    this.longitude = parseFloat(data.substring(20, 29)) / 100000;
  }

  private getSpeedKilometresPerHour(data: string) {
    if (data.substring(29, 32) != "" && parseInt(data.substring(29, 32)))
      this.SpeedKilometresPerHour = parseInt(data.substring(29, 32));
    else this.SpeedKilometresPerHour = 0;
  }

  private getOrientation(data: string) {
    if (parseInt(data.substring(32, 35)))
      this.Orientation = parseInt(data.substring(32, 35));
    else this.Orientation = 0;
  }

  private getIsAvl() {
    if (
      this.IdEvento == Evento.TRANKING_INGINICAO_LIGADA_TRACKING ||
      this.IdEvento == Evento.TRANKING_INGINICAO_DESLIGADA_TRACKING ||
      this.IdEvento == Evento.TRANKING_ANGULACAO_TRACKING
    ) {
      this.IsAvl = 1;
    } else {
      this.IsAvl = 0;
    }
  }

  private getConsumo(data: string, dtSplit: number) {
    //Consumo de acordo com o evento
    switch (this.TipoEstruturaDados) {
      case TipoEstruturaDados.REPORTPARATRACKING:
        this.Consumo = 0;

        if (
          this.dataSplit[dtSplit + 2] != "" &&
          parseInt(this.dataSplit[dtSplit + 2])
        )
          this.SpeedKilometresPerHour = parseInt(this.dataSplit[dtSplit + 2]);
        else if (
          data.substring(29, 32) != "" &&
          parseInt(data.substring(29, 32))
        )
          this.SpeedKilometresPerHour = parseInt(data.substring(29, 32));
        else this.SpeedKilometresPerHour = 0;

        if (
          this.dataSplit.length > dtSplit + 3 &&
          this.dataSplit[dtSplit + 3] != "" &&
          parseInt(this.dataSplit[dtSplit + 3])
        )
          this.Rpm = parseInt(this.dataSplit[dtSplit + 3]);
        else this.Rpm = 0;

        if (
          this.dataSplit.length > dtSplit + 4 &&
          this.dataSplit[dtSplit + 4] != "" &&
          parseInt(this.dataSplit[dtSplit + 4])
        )
          this.DriverId = parseInt(this.dataSplit[dtSplit + 4]);
        else this.DriverId = 0;
        break;
      case TipoEstruturaDados.REPORTPARAEVENTOCOMPLETO:
      case TipoEstruturaDados.REPORTPARAEVENTOSIMPLES:
      case TipoEstruturaDados.REPORTVIAGEM:
        if (
          this.dataSplit[dtSplit + 2] != "" &&
          parseInt(this.dataSplit[dtSplit + 2])
        )
          this.Consumo = parseInt(this.dataSplit[dtSplit + 2]);
        else this.Consumo = 0;
        if (
          this.dataSplit.length > dtSplit + 3 &&
          this.dataSplit[dtSplit + 3] != "" &&
          parseInt(this.dataSplit[dtSplit + 3])
        )
          this.DriverId = parseInt(this.dataSplit[dtSplit + 3]);
        else this.DriverId = 0;
        break;
    }
  }

  private GetIgnicao(ig: string) {
    switch (ig) {
      case "0":
        return "0000";
      case "1":
        return "0001";
      case "2":
        return "0010";
      case "3":
        return "0011";
      case "4":
        return "0100";
      case "5":
        return "0101";
      case "6":
        return "0110";
      case "7":
        return "0111";
      case "8":
        return "1000";
      case "9":
        return "1001";
      case "A":
        return "1010";
      case "B":
        return "1011";
      case "C":
        return "1100";
      case "D":
        return "1101";
      case "E":
        return "1110";
      case "F":
        return "1111";
      default:
        return null;
    }
  }

  private getIgnitionOn(data: string) {
    let ignicao: string | null = this.GetIgnicao(data.substring(38, 39));
    ignicao = ignicao! + this.GetIgnicao(data.substring(39, 40));

    if (ignicao.length >= 8) {
      this.IgnitionOn = parseInt(ignicao.substring(7, 8));
    }
  }

  private resolveDataSplit(dtSplit: number) {
    let qtt: string = this.dataSplit[dtSplit];

    this.Timestamp = new Date(
      parseInt("20" + qtt.substring(4, 6)), //ano
      parseInt(qtt.substring(2, 4)) - 1, //mes
      parseInt(qtt.substring(0, 2)), //dia
      parseInt(qtt.substring(6, 8)),
      parseInt(qtt.substring(8, 10)),
      parseInt(qtt.substring(10, 12))
    );
    this.getOdometer(this.dataSplit[dtSplit + 1]);
    this.getLatLon(qtt);
    this.getSpeedKilometresPerHour(qtt);
    this.getOrientation(qtt);
    this.getIgnitionOn(qtt);
    this.getIsAvl();

    this.getConsumo(qtt, dtSplit);

    //Se o tipo de Envento for completo
    if (
      this.TipoEstruturaDados == TipoEstruturaDados.REPORTPARAEVENTOCOMPLETO
    ) {
      if (
        this.dataSplit.length > dtSplit + 4 &&
        this.dataSplit[dtSplit + 4] != "" &&
        parseInt(this.dataSplit[dtSplit + 4])
      )
        this.DriverId = parseInt(this.dataSplit[dtSplit + 4]);
      else this.DriverId = 0;
      if (
        this.dataSplit[dtSplit + 3] != "" &&
        parseInt(this.dataSplit[dtSplit + 3])
      )
        this.ValueEvent = parseInt(this.dataSplit[dtSplit + 3]);
      else this.ValueEvent = 0;
    } else this.ValueEvent = 0;
  }
}
