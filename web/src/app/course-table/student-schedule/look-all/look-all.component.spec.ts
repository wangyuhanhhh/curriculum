import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookAllComponent } from './look-all.component';

describe('LookAllComponent', () => {
  let component: LookAllComponent;
  let fixture: ComponentFixture<LookAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LookAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LookAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
