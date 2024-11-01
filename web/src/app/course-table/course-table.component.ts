import { Component, OnInit } from '@angular/core';
import { CourseInfo, WeeklySchedule } from 'src/app/entity/course-info';


@Component({
  selector: 'app-course-table',
  templateUrl: './course-table.component.html',
  styleUrls: ['./course-table.component.css']
})
export class CourseTableComponent implements OnInit {
  weeks = ['1', '2', '3', '4', '5', '6', '7'];
  days = ['1', '2', '3', '4', '5', '6', '7'];
  periods = [
    { time: '08:00-08:45' },
    { time: '08:50-09:35' },
    { time: '10:05-10:50' },
    { time: '10:55-11:40' },
    { time: '13:30-14:15' },
    { time: '14:20-15:05' },
    { time: '15:25-16:10' },
    { time: '16:15-17:00' },
    { time: '18:00-18:45' },
    { time: '18:50-20:35' },
    { time: '20:40-21:25' },
  ];

  // 使用 WeeklySchedule 类型定义课表数据
  schedule: WeeklySchedule = {
    2: {
      '08:00-08:45': { courseName: '数学'},
      '10:05-10:50': { courseName: '英语'},
    },
    1: {
      '10:05-10:50': { courseName: '物理'},
    },
    3: {
      '14:20-15:05': { courseName: '化学'},
      '20:40-21:25': { courseName: '生物'},
    }
  };

  selectedWeek = 1;

  constructor() { }

  getClassInfo(day: any, time: string): CourseInfo | null {
    return this.schedule[day]?.[time] || null;
  }

  ngOnInit(): void {
  }

}
