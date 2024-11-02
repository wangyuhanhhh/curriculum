import {Term} from "./term";

/**
 * 课程
 */
export class Course {
    id: number;
    name: string;
    // 学期
    term: Term;
    // 选修 必修
    type: number;
    // 单周 双周 全周
    status: number;
    // 周数
    weeks: number[];
    // 开始周
    start_weeks: number;
    // 结束周
    end_weeks: number;
    // 星期几
    week: number;
    // 节次
    range: string;
    // 开始节次
    begin: number;
    // 结束节次
    end: number;
    // 课程安排id
    courseInfoId: number;
    constructor(
      id?: number,
      name?: string,
      term?: Term,
      type?: number,
      status?: number,
      weeks?: number[],
      week?: number,
      range?: string,
      begin?: number,
      end?: number,
      courseInfoId?: number) {
      this.id = id as number;
      this.name = name as string;
      this.term = term as Term;
      this.type = type as number;
      this.status = status as number;
      this.weeks = weeks as number[];
      this.week = week as number;
      this.range = range as string;
      this.begin = begin as number;
      this.end = end as number;
      this.courseInfoId = courseInfoId as number;
    }
  }
