export enum TypePacket {
  'Position',
  'General',
}

export interface Equipment {
  orgid: string;
  unitid: string;
  assetID: string;
  Databasename: string;
  username: string;
  password: string;
  SerialNumber: string;
  serverName: string;
  OrganizationName: string;
  sinotico: string;
  transdatavalidadorid: null | string;
  sigfoxid: null | string;
  prodataid: null | string;
  omnilinkid: null | string;
  globalstarid: null | string;
  registrationnumber: null | string
}

export class PacketReceived {
  UnitId!: string;
  Equipment: Equipment; //não consegui identificar
  TypePacket!: TypePacket;
  IsValidDateTime!: boolean;
  MessageId!: string;
  MessageStored!: string;
  Message: string;
  
  constructor(message: string, equiments : Record<string, Equipment>) {
    this.UnitId = this.GetUnitId(message);
    this.Equipment = this.GetEquipment(equiments);
    this.TypePacket = this.GetTypePacket(message);    
    this.IsValidDateTime = this.IsValidDateTimePosition(
      message,
      this.TypePacket
    );
    this.MessageId = this.GetMsgId(message);
    this.MessageStored = this.GetMessageStored(message);
    this.Message = message;
  }


  private GetEquipment(equiments : Record<string, Equipment>){
    const equipment = equiments[this.UnitId];
    if (equipment) {
      return equipment;
    }
    throw new Error("Equipment not found");
  }

  private GetUnitId(message: string) {
    let inicioID = message.indexOf("ID=") + 3;
    let fimID = message.indexOf("#") - 1;
    let id = message.substring(inicioID, fimID);

    return id;
  }

  private GetTypePacket(message: string) {      
    if (message.substring(1, 4) == "RUV") {
      return TypePacket.Position;
    } else {
      return TypePacket.General;
    }
  }

  private IsValidDateTimePosition(message: string, type: TypePacket) {
    if (type == TypePacket.Position) {
      let indexVirgula1 = message.indexOf(",");
      let indexPontoVirgula1 = message.indexOf(";");

      let dataSplit = message
        .substring(indexVirgula1 + 1, indexPontoVirgula1)
        .split(",");

      let ultimoProcesso = "";
      if (dataSplit.length > 1) {
        ultimoProcesso = dataSplit[1];
      }

      if (
        dataSplit[0].length > 10 &&
        parseInt(dataSplit[0].substring(0, 2)) < 32
      ) {
        let aux = dataSplit[0];
        let data = new Date(
          parseInt("20" + aux.substring(4, 6)), //ano
          parseInt(aux.substring(2, 4)) - 1, //mes
          parseInt(aux.substring(0, 2)) //dia
        );

        if (data.getFullYear() > 2000) {
          return true;
        } else {
          return false;
        }
        //   if (dataPacote.Year == 1900) return false;
        //   else return true;

        //   if (dataPacote.Year == 2000) return false;
        //   else return true;
      } else if (dataSplit.length > 6) {
        let aux = dataSplit[4];
        let data = new Date(
          parseInt("20" + aux.substring(4, 6)), //ano
          parseInt(aux.substring(2, 4)) - 1, //mes
          parseInt(aux.substring(0, 2)) //dia
        );
        if (data.getFullYear() > 2000) {
          return true;
        } else {
          return false;
        }
      } else if (ultimoProcesso.length > 20) {
        let aux = dataSplit[4];
        let data = new Date(
          parseInt("20" + aux.substring(4, 6)), //ano
          parseInt(aux.substring(2, 4)) - 1, //mes
          parseInt(aux.substring(0, 2)) //dia
        );

        if (data.getFullYear() > 2000) {
          return true;
        } else {
          return false;
        }
      } else return true;
    } else return false;
  }

  private GetMsgId(message: string) {
    let InicioIDMsg = message.indexOf("#") + 1;
    let IDMsg = message.substring(InicioIDMsg);

    IDMsg = IDMsg.substring(0, IDMsg.indexOf(";"));
    return IDMsg;
  }
  // Não eh salvo no banco
  private GetMessageStored(message: string) {
    let InicioIDMsg = message.indexOf("#") - 1;
    let msg = message.substring(0, InicioIDMsg) + "<";
    return msg;
  }
}
