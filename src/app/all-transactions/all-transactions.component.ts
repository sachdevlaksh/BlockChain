import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { AllTransactionsService } from "../services/all-transactions.service";

@Component({
  selector: 'app-all-transactions',
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.css']
})
export class AllTransactionsComponent implements OnInit {

  private errorMessage;
  private allTransactions;

  private systemTransactions = [];
  private performedTransactions = [];

  constructor(private serviceTransaction:AllTransactionsService, fb: FormBuilder) {

  };

    ngOnInit(): void {

    //call to retrieve transactions
    this.loadAllTransactions();

  }
 //sort the objects on key
  sortByKey(array, key): Object[] {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  //get all transactions
  loadAllTransactions(): Promise<any> {

    //initialize arrays to collect performed and system transactions
    let tempList = [];
    let systemList = [];
    let performedList = [];

    //collect all transactions for display
    return this.serviceTransaction.getTransactions()
    .toPromise()
    .then((result) => {
      
      //sort the transactions by timestamp
      result = this.sortByKey(result, 'transactionTimestamp');
      this.errorMessage = null;
      
      //for each transaction, determine whether system transaction
      result.forEach(transaction => {
        tempList.push(transaction);

        //split the transactionType string
        var importClass = transaction["transactionType"];
        var importClassArray = importClass.split(".");

        //if `hyperledger` string in the transactionType, then add to systemList, otherwise performedList
       // if(importClassArray[1] == 'hyperledger'){
      //    systemList.push(transaction);
      //  }
		if(importClassArray[4] == 'AddAsset'){
			performedList.push(transaction);
		}
		if(importClassArray[4] == 'Verification'){
			performedList.push(transaction);
		}
		if(importClassArray[4] == 'Monitoring'){
			performedList.push(transaction);
		}
		if(importClassArray[4] == 'Disbursement'){
			performedList.push(transaction);
		}
      //  else {
     //     performedList.push(transaction);
      //  }
      });

      //update object
      this.systemTransactions = systemList;
      this.performedTransactions = performedList;
      this.allTransactions = tempList;
      console.log(this.allTransactions)
      console.log(this.performedTransactions)
      console.log(this.systemTransactions)
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }
}
