import {FarmerApplicationComponent  } from './farmer-application/farmer-application.component';
import {NurseryComponent} from "./nursery/nursery.component";
import {LoginComponent} from "./login/login.component";
import {TreasuryComponent} from "./treasury/treasury.component";
import {ViewFarmerRecordComponent} from "./view-farmer-record/view-farmer-record.component";
import { ForestOfficerInspectionComponent } from './forest-officer-inspection/forest-officer-inspection.component';

import {NgModule } from '@angular/core';
import {Routes, RouterModule } from '@angular/router';

import {AuthGuard} from './guards/auth-guard';

const routes: Routes = [
  { path: 'farmerApplication', component: FarmerApplicationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'approveFarmerApplicationByNursery', component: NurseryComponent},
  { path: 'verifyAndReleaseFundByTreasury', component: TreasuryComponent,canActivate: [AuthGuard] },
  { path: 'viewFarmerRecord/:id', component: ViewFarmerRecordComponent },
  { path: 'verifyAndUpdateNoOfSeedSurvived',component:ForestOfficerInspectionComponent},
  { path: '', redirectTo: '/login',pathMatch:'full'},
  { path: '**', pathMatch:'full', redirectTo: '/login'}
] 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
