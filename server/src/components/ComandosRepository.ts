import { Comando } from "../schemas/comandoSchema";
import { ComandoInterface } from "../interfaces/comandoInterface";

export class ComandosRepository {
  constructor() {}

  async GetComandoPendente(
    unitid: string,
    nrmsg: string
  ): Promise<ComandoInterface> {
    const comandos = await Comando.findOne({ UnitID: unitid, NroMsg: nrmsg });

    return comandos;
  }

  async GetComandoPendente2(unitid: string): Promise<ComandoInterface> {
    const comandos = await Comando.findOne({
      UnitID: unitid,
      $or: [{ Status: 0 }, { Status: 1 }],
      //MensagemResp: null,
    });
    return comandos;
  }

  async updateComando(comando: ComandoInterface) {
    await Comando.findByIdAndUpdate(comando._id, comando);
  }
}
