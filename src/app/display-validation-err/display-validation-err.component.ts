import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-display-validation-err',
  templateUrl: './display-validation-err.component.html',
  styleUrls: ['./display-validation-err.component.css']
})
export class DisplayValidationErrComponent implements OnInit {
  @Input() errorMsg: string;
  @Input() displayError: boolean;
  constructor() { }

  ngOnInit() {
  }

}
