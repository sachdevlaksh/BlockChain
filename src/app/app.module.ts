import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from '@agm/core';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NurseryComponent } from './nursery/nursery.component';
import { DisplayValidationErrComponent } from './display-validation-err/display-validation-err.component';
import { TreasuryComponent } from './treasury/treasury.component';
import { FarmerApplicationComponent } from './farmer-application/farmer-application.component';
import { ViewFarmerRecordComponent } from './view-farmer-record/view-farmer-record.component';
import { GmapsComponent } from './gmaps/gmaps.component';
import { ForestOfficerInspectionComponent } from './forest-officer-inspection/forest-officer-inspection.component';

import { NurserySurveyDataService } from './services/nursery-survey-data.service';
import { ManageFarmerRecordService } from './services/manage-farmer-record.service'
import { LoginAuthenticationService } from './services/login-authentication.service';
import { VerifyFarmerRecordService } from './services/verify-farmer-record.service';
import { InspectorVerificationService } from './services/inspector-verification.service';
import { ApiService } from './services/api.service';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './guards/auth-guard';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NurseryComponent,
    DisplayValidationErrComponent,
    TreasuryComponent,
    FarmerApplicationComponent,
    GmapsComponent,
    ViewFarmerRecordComponent,
    ForestOfficerInspectionComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCSIFuXPQXel1splGkx5ElXoU1bL60Jn-I' //credentials for Angular google maps
    }), 
    AppRoutingModule

  ],
  providers: [AuthGuard,ManageFarmerRecordService,NurserySurveyDataService,LoginAuthenticationService,VerifyFarmerRecordService,ApiService,InspectorVerificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
