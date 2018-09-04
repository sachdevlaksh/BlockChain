import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFarmerRecordComponent } from './view-farmer-record.component';

describe('ViewFarmerRecordComponent', () => {
  let component: ViewFarmerRecordComponent;
  let fixture: ComponentFixture<ViewFarmerRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFarmerRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFarmerRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
