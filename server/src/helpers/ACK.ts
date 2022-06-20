export class ACK {
  constructor() {}

  GetMensagemAck(mensagem: string) {
    let primeiroPontoVirgula = mensagem.indexOf(";");
    let ultimoPontoVirgual = mensagem.lastIndexOf(";");

    let primeiraParteDaMensagem = `>ACK${mensagem.substring(
      primeiroPontoVirgula,
      ultimoPontoVirgual
    )}`;
    return `${primeiraParteDaMensagem}*${this.GetChecksum(
      primeiraParteDaMensagem
    )}<";`;
  }

  GetChecksum(mensagem: string) {
    let r;
    let calc = 0;
    let caracter;
    let calculated_checksum;

    for (r = 0; r < mensagem.length; r++) {
      if (mensagem[r] == "*" && mensagem[r - 1] == ";") break;
      caracter = parseInt(mensagem[r]);
      calc = calc ^ caracter;
    }
    calculated_checksum = calc.toString(16);
    return calculated_checksum;
  }
}
