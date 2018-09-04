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
import { GoKService } from './GoK.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-gok',
  templateUrl: './GoK.component.html',
  styleUrls: ['./GoK.component.css'],
  providers: [GoKService]
})
export class GoKComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  GoKRecordsId = new FormControl('', Validators.required);
  inspectionCompletedForYear = new FormControl('', Validators.required);
  NoSeedSurvForYear = new FormControl('', Validators.required);
  landrecord = new FormControl('', Validators.required);
  ownerEntity = new FormControl('', Validators.required);

  constructor(public serviceGoK: GoKService, fb: FormBuilder) {
    this.myForm = fb.group({
      GoKRecordsId: this.GoKRecordsId,
      inspectionCompletedForYear: this.inspectionCompletedForYear,
      NoSeedSurvForYear: this.NoSeedSurvForYear,
      landrecord: this.landrecord,
      ownerEntity: this.ownerEntity
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceGoK.getAll()
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
      $class: 'org.kapy.payments.GoK',
      'GoKRecordsId': this.GoKRecordsId.value,
      'inspectionCompletedForYear': this.inspectionCompletedForYear.value,
      'NoSeedSurvForYear': this.NoSeedSurvForYear.value,
      'landrecord': this.landrecord.value,
      'ownerEntity': this.ownerEntity.value
    };

    this.myForm.setValue({
      'GoKRecordsId': null,
      'inspectionCompletedForYear': null,
      'NoSeedSurvForYear': null,
      'landrecord': null,
      'ownerEntity': null
    });

    return this.serviceGoK.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'GoKRecordsId': null,
        'inspectionCompletedForYear': null,
        'NoSeedSurvForYear': null,
        'landrecord': null,
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
      $class: 'org.kapy.payments.GoK',
      'inspectionCompletedForYear': this.inspectionCompletedForYear.value,
      'NoSeedSurvForYear': this.NoSeedSurvForYear.value,
      'landrecord': this.landrecord.value,
      'ownerEntity': this.ownerEntity.value
    };

    return this.serviceGoK.updateAsset(form.get('GoKRecordsId').value, this.asset)
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

    return this.serviceGoK.deleteAsset(this.currentId)
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

    return this.serviceGoK.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'GoKRecordsId': null,
        'inspectionCompletedForYear': null,
        'NoSeedSurvForYear': null,
        'landrecord': null,
        'ownerEntity': null
      };

      if (result.GoKRecordsId) {
        formObject.GoKRecordsId = result.GoKRecordsId;
      } else {
        formObject.GoKRecordsId = null;
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

      if (result.landrecord) {
        formObject.landrecord = result.landrecord;
      } else {
        formObject.landrecord = null;
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
      'GoKRecordsId': null,
      'inspectionCompletedForYear': null,
      'NoSeedSurvForYear': null,
      'landrecord': null,
      'ownerEntity': null
      });
  }

}
