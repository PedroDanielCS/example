import mongoose from "mongoose";
export const positionsSinoticoSchema = new mongoose.Schema({
  OrgId: Number,
  AssetId: Number,
  Lat: String,
  Lng: String,
  timestamp: Date,
  speed: Number,
  IgnitionOn: Number,
  Satelites: Number,
  Orientation: Number,
  Odometer: Number,
  Pending: Boolean,
  UnitId: String,
  DriverId: String,
});

export const PositionsSinotico = mongoose.model(
  "positionsSinotico",
  positionsSinoticoSchema
);
