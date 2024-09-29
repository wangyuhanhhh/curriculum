/**
 * 学期
 */
export class Term {
  id: number;
  term: string;
  // tslint:disable-next-line:variable-name
  start_time: Date;
  // tslint:disable-next-line:variable-name
  end_time: Date;
  status: boolean;
  // tslint:disable-next-line:variable-name
  school_id: number;

  constructor(
    {
      id = 0,
      term = '',
      start_time = new Date(0),
      end_time = new Date(0),
      status = false,
      school_id = 1,
    }: {
      id?: number;
      term?: string;
      start_time?: Date;
      end_time?: Date;
      status?: boolean;
      school_id?: number;
    } = {}
  ) {
    this.id = id;
    this.term = term;
    this.start_time = start_time;
    this.end_time = end_time;
    this.status = status;
    this.school_id = school_id;
  }
}

