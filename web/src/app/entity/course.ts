/**
 * 课程
 */
export class Course {
    id: number;
    name: string;
    type: number;
    // 周数
    weeks: number;
    // 星期几
    week: number;
    // 节次
    range: string;
    constructor(
      id?: number,
      name?: string,
      type?: number,
      weeks?: number,
      week?: number,
      range?: string) {
      this.id = id as number;
      this.name = name as string;
      this.type = type as number;
      this.weeks = weeks as number;
      this.week = week as number;
      this.range = range as string;
    }
  }
  