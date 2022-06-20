export interface ComandoInterface {
  _id: BinaryType;
  UnitID: String;
  AssetId: number;
  Mensagem: String;
  Status: number;
  DataCad: Date;
  DataSend: Date;
  DataParaEnv: Date;
  MensagemResp: String;
  NroMsg: String;
  QtdReenvio: number;
  UserId: String;
  IdScriptGrupo: number;
  HeadSendMensagensId: number;
  NomeVeiculo: String;
  GrupoScript: String;
  OrgId: String;
  Ordem: number;
  MotivoEnvio: String;
  QtdComandos: number;
}
