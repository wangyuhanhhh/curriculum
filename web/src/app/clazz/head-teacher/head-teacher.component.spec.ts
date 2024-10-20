import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadTeacherComponent } from './head-teacher.component';

describe('HeadTeacherComponent', () => {
  let component: HeadTeacherComponent;
  let fixture: ComponentFixture<HeadTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
