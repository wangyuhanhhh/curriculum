/**
 * 用户
 */
export class User {
  id: number;
  name: string;
  // 学号
  // tslint:disable-next-line:variable-name
  student_no: string;
  password: string;
  status: number;
  // tslint:disable-next-line:variable-name
  clazz_id: number;
  // tslint:disable-next-line:variable-name
  constructor(id?: number, name?: string, password?: string, student_no?: string, status?: number, clazz_id?: number) {
    this.id = id as number;
    this.name = name as string;
    this.password = password as string;
    this.student_no = student_no as string;
    this.status = status as number;
    this.clazz_id = clazz_id as number;
  }
}
