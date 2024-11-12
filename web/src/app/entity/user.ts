import {Clazz} from './clazz';
import {School} from './school';

/**
 * 用户
 */
export class User {
  id: number;
  name: string;
  username: string;
  // 学号
  // tslint:disable-next-line:variable-name
  student_no: string;
  password: string;
  role: number;
  status: number;
  school: School;
  // tslint:disable-next-line:variable-name
  clazz_id: number;
  clazz: Clazz;

  // tslint:disable-next-line:variable-name max-line-length
  constructor(id?: number, name?: string, username?: string, password?: string, student_no?: string, role?: number,
              status?: number, school?: School, clazz?: Clazz, clazz_id?: number) {
    this.id = id as number;
    this.name = name as string;
    this.username = username as string;
    this.password = password as string;
    this.student_no = student_no as string;
    this.role = role as number;
    this.status = status as number;
    this.school = school as School;
    this.clazz_id = clazz_id as number;
    this.clazz = clazz as Clazz;
  }
}
