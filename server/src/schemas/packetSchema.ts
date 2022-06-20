import mongoose from "mongoose";
export const packetSchema = new mongoose.Schema(
  {
    UnitId: String,
    AddedAtUtc: Date,
    AssetId: Number,
    OrgId: String,
    Database: String,
    Mensage: String,
    Pending: Boolean,
    Password: String,
    Username: String,
    ServerName: String,
  },
  { versionKey: "Version" }
);

export const Packet = mongoose.model("packets", packetSchema);
