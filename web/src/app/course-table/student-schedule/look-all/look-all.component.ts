import { Component, OnInit } from '@angular/core';
import {CourseService} from '../../../../service/course.service';
import {CourseInfo, WeeklySchedule} from '../../../entity/course-info';
import {LoginService} from '../../../../service/login.service';
import {Router} from '@angular/router';
import {CommonService} from '../../../../service/common.service';

@Component({
  selector: 'app-look-all',
  templateUrl: './look-all.component.html',
  styleUrls: ['./look-all.component.css']
})
export class LookAllComponent implements OnInit {
  termSchedule: WeeklySchedule = {};
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

  constructor(private courseService: CourseService,
              private loginService: LoginService,
              private router: Router,
              private commonService: CommonService) { }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe(data => {
      // @ts-ignore
      const user = JSON.parse(data);
      const role = user.role;
      if (role !== 3) {
        this.router.navigate(['dashboard']);
      }
    }, error => this.commonService.showErrorAlert('当前登录用户数据获取失败'));
    this.getAllCourseByLoginUser();
  }

  getClassInfo(day: any, time: number): CourseInfo | null {
    return this.termSchedule[day]?.[time] || null;
  }

  // 获取该学生当前学期的所有课程安排
  getAllCourseByLoginUser(): void {
    this.courseService.getAllCourseByStudent().subscribe(
      data => {
        this.termSchedule = this.convertToWeeklySchedule(data);
      }
    );
  }

  // 将从后端获得的课程安排数据转换为 WeeklySchedule 类型
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
