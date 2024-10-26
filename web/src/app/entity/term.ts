import {School} from './school';
import {Teacher} from "./teacher";

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
  status: number;
  // tslint:disable-next-line:variable-name
  school: School;

  constructor(
    {
      id = 0,
      term = '',
      start_time = new Date(0),
      end_time = new Date(0),
      status = 0,
      school = {
        id: 0,
        school: '',
        teacher: []
      },
    }: {
      id?: number;
      term?: string;
      start_time?: Date;
      end_time?: Date;
      status?: number;
      school?: School;
    } = {}
  ) {
    this.id = id;
    this.term = term;
    this.start_time = start_time;
    this.end_time = end_time;
    this.status = status;
    this.school = school as School;
  }
}

