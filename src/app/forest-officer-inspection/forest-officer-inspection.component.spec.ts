import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForestOfficerInspectionComponent } from './forest-officer-inspection.component';

describe('ForestOfficerInspectionComponent', () => {
  let component: ForestOfficerInspectionComponent;
  let fixture: ComponentFixture<ForestOfficerInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForestOfficerInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForestOfficerInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
