/**
 * 用户
 */
export class User {
  id: number;
  username: string;
  password: string;
  role: number;
  status: boolean;
  clazz_id: number;
  constructor(id?: number, username?: string, password?: string, role?: number, status?: boolean, clazz_id?: number) {
    this.id = id as number;
    this.username = username as string;
    this.password = password as string;
    this.role = role as number;
    this.status = status as boolean;
    this.clazz_id = clazz_id as number;
  }
}
