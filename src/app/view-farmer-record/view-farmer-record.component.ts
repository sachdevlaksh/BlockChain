import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { ActivatedRoute, Params , Router} from '@angular/router'; 
import { Location } from '@angular/common';

import { ManageFarmerRecordService } from '../services/manage-farmer-record.service';

import { FarmerRecord } from '../models/FarmerRecord';
import 'rxjs/add/operator/switchMap'; 

@Component({
  selector: 'app-view-farmer-record',
  templateUrl: './view-farmer-record.component.html',
  styleUrls: ['./view-farmer-record.component.css']
})
export class ViewFarmerRecordComponent implements OnInit {
  farmerReqForm: FormGroup;
  farmerRecord: FarmerRecord = new FarmerRecord(); //initialize farmer record object
  constructor(private formBuilder: FormBuilder,private location: Location, private manageFarmerRecordsService: ManageFarmerRecordService,  private router: Router,private route: ActivatedRoute) { }
  ngOnInit() {
    this.loadForm();
  }

  loadForm() {
    this.farmerReqForm = this.formBuilder.group({
      eid: [''],
      GvtId: [null],
      LnRecId: [null,],
      OwnerNm: [null,],
	  DOB: [null,],
	  LndAddr: [null,],
	  AreaOfLand: [null,],
	  NoSeedReq: [null,],
	  SubmittedDt: [null,],
      preMutationSketch: [null],
      bankDetails: this.formBuilder.group({
        AcNo: [null, ],
        IfscCd: [null, ],
        PanNo: [null, ],
        AdhrNo: [null, ],
        MblNo: [null,],
        EmlId: [null,],
		Addr: [null,]

      })

    });
    this.route.params
          .switchMap((params: Params) => this.manageFarmerRecordsService.getFarmerRecordsByEid(+params['id']))
          .subscribe(
            response => {
              console.log("Received response from getFarmerRecordsByEid service" + JSON.stringify(response));
              if (response !=null && response.success) {
                this.farmerRecord =<FarmerRecord> response.farmerRecords; 
                console.log("farmerRecord object received:" + this.farmerRecord);
                this.farmerReqForm.patchValue(this.farmerRecord);
              }
              }); 

  }

  Back(){
    this.location.back();

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
	
  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      console.log("file :" + file);

    }
  }

 
}