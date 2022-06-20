import crypto from 'crypto';
import mongoose from "mongoose";
export const comandoSchema = new mongoose.Schema({
  _id: {type:Buffer, default: crypto.randomUUID()},
  UnitID: String,
  AssetId: Number,
  Mensagem: String,
  Status: Number,
  DataCad: Date,
  DataSend: Date,
  DataParaEnv: Date,
  MensagemResp: String,
  NroMsg: String,
  QtdReenvio: Number,
  UserId: String,
  IdScriptGrupo: Number,
  HeadSendMensagensId: Number,
  NomeVeiculo: String,
  GrupoScript: String,
  OrgId: String,
  Ordem: Number,
  MotivoEnvio: String,
  QtdComandos: Number,
});

export const Comando = mongoose.model("comandos", comandoSchema);
