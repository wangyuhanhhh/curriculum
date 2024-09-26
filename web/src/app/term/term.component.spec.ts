import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermComponent } from './term.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

describe('TermComponent', () => {
  let component: TermComponent;
  let fixture: ComponentFixture<TermComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermComponent ],
      imports: [FormsModule, HttpClientModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.autoDetectChanges();
  });
});
