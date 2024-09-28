/**
 * 学期
 */
export class Term {
  id: number;
  term: string;
  startTime: Date;
  endTime: Date;
  status: boolean;
  schoolId: number;

  constructor(
    {
      id = 0,
      term = '',
      startTime = new Date(0),
      endTime = new Date(0),
      status = false,
      schoolId = 1,
    }: {
      id?: number;
      term?: string;
      startTime?: Date;
      endTime?: Date;
      status?: boolean;
      schoolId?: number;
    } = {}
  ) {
    this.id = id;
    this.term = term;
    this.startTime = startTime;
    this.endTime = endTime;
    this.status = status;
    this.schoolId = schoolId;
  }
}

