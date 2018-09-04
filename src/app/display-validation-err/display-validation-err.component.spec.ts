import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayValidationErrComponent } from './display-validation-err.component';

describe('DisplayValidationErrComponent', () => {
  let component: DisplayValidationErrComponent;
  let fixture: ComponentFixture<DisplayValidationErrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayValidationErrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayValidationErrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
