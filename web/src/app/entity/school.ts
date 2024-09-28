/**
 * 学校
 */
export class School {
  id: number;
  school: string;
  constructor(id?: number, school?: string) {
    this.id = id as number;
    this.school = school as string;
  }
}
