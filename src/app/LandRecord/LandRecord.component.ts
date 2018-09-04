/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LandRecordService } from './LandRecord.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-landrecord',
  templateUrl: './LandRecord.component.html',
  styleUrls: ['./LandRecord.component.css'],
  providers: [LandRecordService]
})
export class LandRecordComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  eid = new FormControl('', Validators.required);
  LnRecId = new FormControl('', Validators.required);
  NoSeedReq = new FormControl('', Validators.required);
  SubmittedDate = new FormControl('', Validators.required);
  BankDetails = new FormControl('', Validators.required);
  isFarmerRecApproved = new FormControl('', Validators.required);
  inspectionCompletedForYear = new FormControl('', Validators.required);
  NoSeedSurvForYear = new FormControl('', Validators.required);
  AmountProcessed = new FormControl('', Validators.required);
  SeedlingPrice = new FormControl('', Validators.required);
  ownerEntity = new FormControl('', Validators.required);

  constructor(public serviceLandRecord: LandRecordService, fb: FormBuilder) {
    this.myForm = fb.group({
      eid: this.eid,
      LnRecId: this.LnRecId,
      NoSeedReq: this.NoSeedReq,
      SubmittedDate: this.SubmittedDate,
      BankDetails: this.BankDetails,
      isFarmerRecApproved: this.isFarmerRecApproved,
      inspectionCompletedForYear: this.inspectionCompletedForYear,
      NoSeedSurvForYear: this.NoSeedSurvForYear,
      AmountProcessed: this.AmountProcessed,
      SeedlingPrice: this.SeedlingPrice,
      ownerEntity: this.ownerEntity
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceLandRecord.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.kapy.payments.LandRecord',
      'eid': this.eid.value,
      'LnRecId': this.LnRecId.value,
      'NoSeedReq': this.NoSeedReq.value,
      'SubmittedDate': this.SubmittedDate.value,
      'BankDetails': this.BankDetails.value,
      'isFarmerRecApproved': this.isFarmerRecApproved.value,
      'inspectionCompletedForYear': this.inspectionCompletedForYear.value,
      'NoSeedSurvForYear': this.NoSeedSurvForYear.value,
      'AmountProcessed': this.AmountProcessed.value,
      'SeedlingPrice': this.SeedlingPrice.value,
      'ownerEntity': this.ownerEntity.value
    };

    this.myForm.setValue({
      'eid': null,
      'LnRecId': null,
      'NoSeedReq': null,
      'SubmittedDate': null,
      'BankDetails': null,
      'isFarmerRecApproved': null,
      'inspectionCompletedForYear': null,
      'NoSeedSurvForYear': null,
      'AmountProcessed': null,
      'SeedlingPrice': null,
      'ownerEntity': null
    });

    return this.serviceLandRecord.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'eid': null,
        'LnRecId': null,
        'NoSeedReq': null,
        'SubmittedDate': null,
        'BankDetails': null,
        'isFarmerRecApproved': null,
        'inspectionCompletedForYear': null,
        'NoSeedSurvForYear': null,
        'AmountProcessed': null,
        'SeedlingPrice': null,
        'ownerEntity': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.kapy.payments.LandRecord',
      'LnRecId': this.LnRecId.value,
      'NoSeedReq': this.NoSeedReq.value,
      'SubmittedDate': this.SubmittedDate.value,
      'BankDetails': this.BankDetails.value,
      'isFarmerRecApproved': this.isFarmerRecApproved.value,
      'inspectionCompletedForYear': this.inspectionCompletedForYear.value,
      'NoSeedSurvForYear': this.NoSeedSurvForYear.value,
      'AmountProcessed': this.AmountProcessed.value,
      'SeedlingPrice': this.SeedlingPrice.value,
      'ownerEntity': this.ownerEntity.value
    };

    return this.serviceLandRecord.updateAsset(form.get('eid').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceLandRecord.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceLandRecord.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'eid': null,
        'LnRecId': null,
        'NoSeedReq': null,
        'SubmittedDate': null,
        'BankDetails': null,
        'isFarmerRecApproved': null,
        'inspectionCompletedForYear': null,
        'NoSeedSurvForYear': null,
        'AmountProcessed': null,
        'SeedlingPrice': null,
        'ownerEntity': null
      };

      if (result.eid) {
        formObject.eid = result.eid;
      } else {
        formObject.eid = null;
      }

      if (result.LnRecId) {
        formObject.LnRecId = result.LnRecId;
      } else {
        formObject.LnRecId = null;
      }

      if (result.NoSeedReq) {
        formObject.NoSeedReq = result.NoSeedReq;
      } else {
        formObject.NoSeedReq = null;
      }

      if (result.SubmittedDate) {
        formObject.SubmittedDate = result.SubmittedDate;
      } else {
        formObject.SubmittedDate = null;
      }

      if (result.BankDetails) {
        formObject.BankDetails = result.BankDetails;
      } else {
        formObject.BankDetails = null;
      }

      if (result.isFarmerRecApproved) {
        formObject.isFarmerRecApproved = result.isFarmerRecApproved;
      } else {
        formObject.isFarmerRecApproved = null;
      }

      if (result.inspectionCompletedForYear) {
        formObject.inspectionCompletedForYear = result.inspectionCompletedForYear;
      } else {
        formObject.inspectionCompletedForYear = null;
      }

      if (result.NoSeedSurvForYear) {
        formObject.NoSeedSurvForYear = result.NoSeedSurvForYear;
      } else {
        formObject.NoSeedSurvForYear = null;
      }

      if (result.AmountProcessed) {
        formObject.AmountProcessed = result.AmountProcessed;
      } else {
        formObject.AmountProcessed = null;
      }

      if (result.SeedlingPrice) {
        formObject.SeedlingPrice = result.SeedlingPrice;
      } else {
        formObject.SeedlingPrice = null;
      }

      if (result.ownerEntity) {
        formObject.ownerEntity = result.ownerEntity;
      } else {
        formObject.ownerEntity = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'eid': null,
      'LnRecId': null,
      'NoSeedReq': null,
      'SubmittedDate': null,
      'BankDetails': null,
      'isFarmerRecApproved': null,
      'inspectionCompletedForYear': null,
      'NoSeedSurvForYear': null,
      'AmountProcessed': null,
      'SeedlingPrice': null,
      'ownerEntity': null
      });
  }

}
