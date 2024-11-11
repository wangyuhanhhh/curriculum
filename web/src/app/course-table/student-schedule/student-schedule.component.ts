import { Component, OnInit } from '@angular/core';
import {CourseInfo, WeeklySchedule} from '../../entity/course-info';
import {Term} from '../../entity/term';
import {CourseService} from '../../../service/course.service';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-student-schedule',
  templateUrl: './student-schedule.component.html',
  styleUrls: ['./student-schedule.component.css']
})
export class StudentScheduleComponent implements OnInit {

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

  // 对应学期的总周数
  allWeeks = [] as any;
  // 用于保存课程表数据，初始化为一个空对象
  weeklySchedule: WeeklySchedule = {};

  selectedWeek = 0;
  termStatus = false;
  term = {} as Term;

  constructor(private courseService: CourseService) { }

  getClassInfo(day: any, time: number): CourseInfo | null {
    return this.weeklySchedule[day]?.[time] || null;
  }

  ngOnInit(): void {
    this.getMessage();
    this.checkTermStatus();
  }

  getMessage(): void {
    this.courseService.getMessage().subscribe(data => {
      this.term = data.term;
      // 初始化该学期所有周数数组
      this.allWeeks = data.weeks;
      // 在获取 term 数据后，计算当前周
      this.getCurrentWeek();
      // 成功设置好当前周后，获取对应的课程表
      this.getCourseTableByWeek();
    });
  }

  // 计算当前周，用于默认选中
  getCurrentWeek(): void {
    const currentDate = new Date();
    const startDate = new Date(this.term.start_time);
    const diffInTime = currentDate.getTime() - startDate.getTime();
    const diffInDays = diffInTime / (1000 * 60 * 60 * 24);
    // 将当前周设为默认
    this.selectedWeek = Math.ceil(diffInDays / 7);
  }

  checkTermStatus(): void {
    // 检查学期状态的逻辑
    this.courseService.checkTerm().subscribe(ResponseBody => {
      this.termStatus = ResponseBody.data;
    });
  }

  // 根据周数来获取当前学生的课表
  getCourseTableByWeek(): void {
    const httpParams = new HttpParams().append('week', this.selectedWeek.toString());
    this.courseService.getCourseTableByWeek(httpParams).subscribe(data => {
      this.weeklySchedule = this.convertToWeeklySchedule(data);
    });
  }

  // 将从后端获得的课程安排数据转换为 WeeklySchedule 类型
  convertToWeeklySchedule(data: any[]): WeeklySchedule {
    const weeklySchedule: WeeklySchedule = {};

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
        };
      }
    });
    return weeklySchedule;
  }
}
