// 定义课程信息的接口
export interface CourseInfo {
  courseName: string;   // 课程名称
}

// 定义单日的课表结构
export type DaySchedule = {
  [time: string]: CourseInfo; // 时间段（如 '08:00-08:45'）作为键，值为课程信息
};

// 定义整周课表的结构
export type WeeklySchedule = {
  [day: number]: DaySchedule; // 周几作为键（1 表示周一，2 表示周二等），值为对应的 DaySchedule
};
