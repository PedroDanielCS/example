import { Equipment, PacketReceived } from "../src/components/PacketReceived";

const mockedEquiments: Record<string, Equipment> = {
    "9296": {
      "orgid": "15",
      "unitid": "9296",
      "assetID": "674",
      "Databasename": "fakeDatabasename",
      "username": "fake-username",
      "password": "fake-password",
      "SerialNumber": "20F81027",
      "serverName": "fake-serverName",
      "OrganizationName": "fake-OrganizationName",
      "sinotico": "0",
      "transdatavalidadorid": null,
      "sigfoxid": null,
      "prodataid": null,
      "omnilinkid": null,
      "globalstarid": null,
      "registrationnumber": null
    },
}
describe("Test packet parse", () => {

  it("shoud  valid RUV0101's package to parsed", () => {
    const raw = ">RUV0101,080622095959-0812313-03509304022112300DF0001 04081123 000 16980000022004022823,663522520,00022,01234,00000,08981,228131500;ID=9296;#2D06;*0D<";
    const packet = new PacketReceived(raw, mockedEquiments);

    expect(packet).toEqual({
        "UnitId": "9296",
        "Message": raw,
        "Equipment": mockedEquiments["9296"],
        "TypePacket": 0,
        "IsValidDateTime": true,
        "MessageId": "2D06",
        "MessageStored": ">RUV0101,080622095959-0812313-03509304022112300DF0001 04081123 000 16980000022004022823,663522520,00022,01234,00000,08981,228131500;ID=9296<"
    });
});

});
