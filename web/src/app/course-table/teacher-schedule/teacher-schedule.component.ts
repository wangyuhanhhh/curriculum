import { Component, OnInit } from '@angular/core';
import {TeacherService} from '../../../service/teacher.service';
import {LoginService} from '../../../service/login.service';
import {BehaviorSubject} from 'rxjs';
import {CourseService} from '../../../service/course.service';
import {FormControl, FormGroup} from '@angular/forms';
import {CourseInfo, WeeklySchedule} from '../../entity/course-info';

@Component({
  selector: 'app-teacher-schedule',
  templateUrl: './teacher-schedule.component.html',
  styleUrls: ['./teacher-schedule.component.css']
})
export class TeacherScheduleComponent implements OnInit {

  // 定义 schoolId$, 用于异步获取 schoolId
  schoolID$ = new BehaviorSubject<number | null>(null);
  formGroup = new FormGroup({
    clazzId: new FormControl(null),
  });
  termSchedule: WeeklySchedule = {};
  termStatus = false;
  days = ['1', '2', '3', '4', '5', '6', '7'];
  periods = [
    { time: 1 },
    { time: 2 },
    { time: 3 },
    { time: 4 },
    { time: 5 },
    { time: 6 },
    { time: 7 },
    { time: 8 },
    { time: 9 },
    { time: 10 },
    { time: 11 },
  ];

  constructor(private teacherService: TeacherService,
              private loginService: LoginService,
              private courseService: CourseService) { }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe(data => {
      if (data) {
        const jsonString = data;
        // @ts-ignore
        const userdata = JSON.parse(jsonString);
        const userId = userdata.id;
        this.teacherService.getSchoolIdByLoginUser(userId).subscribe(id => {
          this.schoolID$.next(id);
        });
      }
    });
    this.checkTermStatus();
  }

  checkTermStatus(): void {
    // 检查学期状态的逻辑
    this.courseService.checkTermOfTeacher().subscribe(ResponseBody => {
      this.termStatus = ResponseBody.data;
      console.log(this.termStatus);
    });
  }

  getCourseTableByClazz(): void {
    const clazzId = this.formGroup.get('clazzId')?.value;
    if (clazzId) {
      this.courseService.getAllCourseByClazz(clazzId).subscribe(data => {
        this.termSchedule = this.convertToWeeklySchedule(data);
      });
    } else {
      console.warn('班级ID未选择');
    }
  }

  getClassInfo(day: any, time: number): CourseInfo | null {
    return this.termSchedule[day]?.[time] || null;
  }

  convertToWeeklySchedule(data: any[]): WeeklySchedule {
    const weeklySchedule: WeeklySchedule = {};

    // 定义状态映射
    const statusMapping: { [key: number]: string } = {
      3: '全',
      1: '双',
      2: '单'
    };

    data.forEach(item => {
      const day = item.week; // week 表示周几
      const begin = item.begin; // begin 表示开始节数
      const length = item.length; // length 表示持续节数

      // 初始化 daySchedule 如果不存在
      if (!weeklySchedule[day]) {
        weeklySchedule[day] = {};
      }

      const daySchedule = weeklySchedule[day];

      // 填充指定的小节数
      for (let i = 0; i < length; i++) {
        const time = begin + i;
        daySchedule[time] = {
          courseName: item.courseName,
          startWeek: item.start_weeks,
          endWeek: item.end_weeks,
          status: statusMapping[item.status] || '未知'  // 映射状态
        };
      }
    });
    return weeklySchedule;
  }
}
