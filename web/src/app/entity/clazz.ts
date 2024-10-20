import {School} from './school';
import {Teacher} from './teacher';

/**
 * 班级
 */
export class Clazz {
    id: number;
    clazz: string;
    school: School;
    teacher: Teacher;
    constructor(id?: number, clazz?: string, school?: School, teacher?: Teacher) {
      this.id = id as number;
      this.clazz = clazz as string;
      this.school = school as School;
      this.teacher = teacher as Teacher;
    }
}
