var udp = require("dgram");
const { readFile, writeFileSync } = require("fs");

var client = udp.createSocket("udp4");

client.on("message", (msg, info) => {
  writeFileSync("arquivo.txt", msg.toString());
  console.log("Dados recebidos do servidor : " + msg.toString());
  console.log(
    "Tamanho: %d bytes, di IP: %s:%d\n",
    msg.length,
    info.address,
    info.port
  );
});

// readFile("entradas.txt", (err, file) => {
//   if (err) throw err;
//   entradas = file.toString().split("\n");
//   entradas.forEach((element) => {
//     client.send(element, 2222, "localhost", function (error) {
//       if (error) {
//         client.close();
//       } else {
//         console.log("Dados Enviados");
//       }
//     });
//   });
// });

// var data =
//   ">RUV03113,080622095959-0587521-03522091017123300DB0000 \n04171923 \n000 16980000009304222784,314362500,123023500,\n1057427559,00114;ID=AA59;#14D6;*03<";
// var data = '>QUT18;ID=3830;#F2DE;*32<'
// var data = '>VS1903,65217,000,29,03,1,4,FFFFFFFF,0,0;ID=A8IV;#F306;*2B<'
var data =
  ">RUV01113,080622095959-0587521-03522091017123300DB0000 04171923 000 16980000009304222784,314362500,123023500,1057427559,00114;ID=AA59;#14D6;*03<";

client.send(data, 2222, "localhost", (error) => {
  if (error) {
    client.close();
  } else {
    console.log("Dados Enviados");
  }
});

setTimeout(function () {
  client.close();
}, 2000);
