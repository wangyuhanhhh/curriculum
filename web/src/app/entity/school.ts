import {Teacher} from "./teacher";

/**
 * 学校
 */
export class School {
  id: number;
  school: string;
  teacher: Teacher[]; // 这里的教师是一个数组
  constructor(id?: number, school?: string, teacher?: Teacher) {
    this.id = id as number;
    this.school = school as string;
    this.teacher = [] as Teacher[];
  }
}
