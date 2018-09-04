export class FarmerRecord {
  GvtId: number;
  LnRecId: string;
  OwnerNm: string;
  DOB: number;
  LndAddr:string;
  AreaOfLand:number;
  NoSeedReq:number;
  NoSeedSurved:number;
  bank: Bank;
  preMutationSketch: string;
  isFarmerRecApproved : boolean;
  eid:number;
  SubmittedDt:Date;
  ReqStatus:string;
  constructor() { }

}

export class Bank {
  AcNo: number;
  IfscCd:string;
  PanNo:string;
  AdhrNo: number;
  MblNo: number;
  EmlId:string;
  Addr: string;
  constructor() { }
}
