import {School} from './school';

export class Teacher {
  id: number;
  name: string;
  username: string;
  role: number;
  // 学号
  // tslint:disable-next-line:variable-name
  teacher_no: string;
  // tslint:disable-next-line:variable-name
  user_id: number;
  // tslint:disable-next-line:variable-name
  school: School;
  constructor(id?: number, name?: string, username?: string, role?: number, teacher_no?: string, user_id?: number, school?: School) {
    this.id = id as number;
    this.name = name as string;
    this.username = username as string;
    this.role = role as number;
    this.teacher_no = teacher_no as string;
    this.user_id = user_id as number;
    this.school = school as School;
  }
}
