import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.kapy.payments{
   export enum OwnerEntity {
      FarmerAgent,
      NurseryAdmin,
      InspectionOfficer,
      TreasuryAdmin,
   }
   export class FarmerAgent extends Participant {
      FarmerAgentId: string;
      landrecord: LandRecord;
   }
   export class NurseryAdmin extends Participant {
      nurseryId: string;
      landrecord: LandRecord;
   }
   export class InspectionOfficer extends Participant {
      InspectionOfficerId: string;
      landrecord: LandRecord;
   }
   export class TreasuryAdmin extends Participant {
      TreasuryId: string;
      landrecord: LandRecord;
   }
   export class LandRecord extends Asset {
      eid: string;
      LnRecId: string;
      NoSeedReq: number;
      SubmittedDate: Date;
      BankDetails: string;
      isFarmerRecApproved: boolean;
      inspectionCompletedForYear: number;
      NoSeedSurvForYear: number;
      AmountProcessed: number;
      SeedlingPrice: number;
      ownerEntity: OwnerEntity;
   }
   export class Nursery extends Asset {
      nurseryRecordsId: string;
      status: string;
      landrecord: LandRecord;
      ownerEntity: OwnerEntity;
   }
   export class GoK extends Asset {
      GoKRecordsId: string;
      inspectionCompletedForYear: number;
      NoSeedSurvForYear: number;
      landrecord: LandRecord;
      ownerEntity: OwnerEntity;
   }
   export class Treasury extends Asset {
      TreasuryRecordsId: string;
      SeedlingPrice: number;
      landrecord: LandRecord;
      ownerEntity: OwnerEntity;
   }
   export class Verification extends Transaction {
      landrecord: LandRecord;
      nursery: Nursery;
   }
   export class Monitoring extends Transaction {
      landrecord: LandRecord;
      gok: GoK;
   }
   export class Disbursement extends Transaction {
      landrecord: LandRecord;
      treasury: Treasury;
   }
// }
