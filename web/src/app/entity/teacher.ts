export class Teacher {
  id: number;
  name: string;
  // 学号
  // tslint:disable-next-line:variable-name
  teacher_no: string;
  password: string;
  // tslint:disable-next-line:variable-name
  user_id: number;
  // tslint:disable-next-line:variable-name
  constructor(id?: number, name?: string, password?: string, teacher_no?: string, user_id?: number) {
    this.id = id as number;
    this.name = name as string;
    this.password = password as string;
    this.teacher_no = teacher_no as string;
    this.user_id = user_id as number;
  }
}
