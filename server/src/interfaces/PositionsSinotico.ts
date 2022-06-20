export interface PositionsSinoticoInterface {
  OrgId: number;
  AssetId: number;
  Lat: string;
  Lng: string;
  timestamp: Date;
  speed: number;
  IgnitionOn: number;
  Satelites?: number;
  Orientation: number;
  Odometer: number;
  Pending: boolean;
  Qtt?: string;

  //  DbGeography point
  // {
  //     get
  //     {
  //         return DbGeography.PointFromText("POINT(" + Lng + " " + Lat + ")", 4326);
  //     }
  // }

  UnitId: string;
  DriverId: string;
}
