import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerApplicationComponent } from './farmer-application.component';

describe('FarmerApplicationComponent', () => {
  let component: FarmerApplicationComponent;
  let fixture: ComponentFixture<FarmerApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmerApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
