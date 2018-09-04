import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { ManageFarmerRecordService } from '../services/manage-farmer-record.service';
import { Router } from '@angular/router';
import { FarmerRecord } from '../models/FarmerRecord';


@Component({
  selector: 'app-farmer-application',
  templateUrl: './farmer-application.component.html',
  styleUrls: ['./farmer-application.component.css']
})
export class FarmerApplicationComponent implements OnInit {
  farmerReqForm: FormGroup;
  farmerRecord: FarmerRecord = new FarmerRecord(); //initialize Farmer record object
  isSubmitSuccessful: boolean = false;
 constructor(private formBuilder: FormBuilder, private manageFarmerRecordService: ManageFarmerRecordService) { }
  ngOnInit() {
    this.createForm();
  }
 // creating form with null values 
  createForm() {
    this.isSubmitSuccessful = false;
    this.farmerReqForm = this.formBuilder.group({
      eid: [''],
	  SubmittedDt:[''],
      GvtId: [null, Validators.required],
      LnRecId: [null, Validators.required],
      OwnerNm: [null, Validators.required],
	  DOB: [null, Validators.required],
	  LndAddr: [null, Validators.required],
	  AreaOfLand: [null, Validators.required],
	  NoSeedReq: [null, Validators.required],
      preMutationSketch: [null],
	  bankDetails: this.formBuilder.group({
        AcNo: [null, Validators.required],
        IfscCd: [null, Validators.required],
        PanNo: [null, Validators.required],
        AdhrNo: [null, Validators.required],
        MblNo: [null, Validators.required],
        EmlId: [null, Validators.required],
		Addr: [null, Validators.required]

      })
    });

  }
  isFieldValid(field: string) {
    return !this.farmerReqForm.get(field).valid && this.farmerReqForm.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }
 
  onSubmit() {
   console.log('inside Submit');
    if (this.farmerReqForm.valid) {
      console.log('form valid success');
      //sync the form model with the data model
      this.farmerRecord = <FarmerRecord>this.farmerReqForm.value;
      this.farmerRecord.eid =parseInt(this.farmerRecord.GvtId.toString().substr(0, 6) + this.farmerRecord.LnRecId.toString().substr(0, 3));
	  this.farmerRecord.SubmittedDt=new Date();
	  this.farmerRecord.ReqStatus = "submitted";
      console.log("eid generated: " + this.farmerRecord.eid);

      this.manageFarmerRecordService.addFarmerRecordKapy(this.farmerRecord)
        .subscribe(
        response => {
          console.log("res received addFarmerRecord service" + JSON.stringify(response));

          if (response !=null && response.success) {
            //  form submission is successful
            this.isSubmitSuccessful = true;
          }
        });
    } else {
      this.validateAllFormFields(this.farmerReqForm);
    }
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      console.log("file :" + file);

    }
  }

  submitNew() {
    this.createForm();
  }

  validateAllFormFields(formGroup: FormGroup) {
  console.log('inside validateAllFormFields');
    Object.keys(formGroup.controls).forEach(field => {
      console.log(field);
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
