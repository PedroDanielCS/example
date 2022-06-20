import { TypeSUC } from "../enums/TypeSUC";

export class ValidatePacket {
  constructor() {}

  /**
   * IsRUV
   */
  public IsRUV(message: string): boolean {
    return message.substring(1, 4) == "RUV";
  }

  public IsValid(message: string): boolean {
    if (message.includes("E_ERROR") || message.length == 0 || message == null) {
      return false;
    }

    let indexPontoVirgula1 = message.indexOf(";");
    let dataSplit = message.substring(4, indexPontoVirgula1).split(",");

    let typeSUC: TypeSUC = this.GetTypeSUC(message);
    switch (typeSUC) {
      case TypeSUC.SUC00:
      case TypeSUC.SUC02:
        return dataSplit.length >= 6;
      case TypeSUC.SUC01:
        return dataSplit.length >= 6;
      case TypeSUC.SUC03:
        return dataSplit.length >= 5;
      case TypeSUC.ERROR:
      default:
        return false;
    }
  }

  public GetTypeSUC(message: string): TypeSUC {
    let indexPontoVirgula1 = message.indexOf(";");
    let _message = message.substring(4, indexPontoVirgula1);

    let dataSplit = _message.split(",");
    let ruv = dataSplit[0];
    let typeSuc = ruv.substring(0, 2);

    let typeSUC: TypeSUC;
    switch (typeSuc) {
      case "00":
        typeSUC = TypeSUC.SUC00;
        break;
      case "01":
        typeSUC = TypeSUC.SUC01;
        break;
      case "02":
        typeSUC = TypeSUC.SUC02;
        break;
      case "03":
        typeSUC = TypeSUC.SUC03;
        break;
      default:
        typeSUC = TypeSUC.ERROR;
        break;
    }
    return typeSUC;
  }
}
