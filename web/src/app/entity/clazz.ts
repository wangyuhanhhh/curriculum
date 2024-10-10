import {School} from './school';

/**
 * 班级
 */
export class Clazz {
    id: number;
    clazz: string;
    school: School;
    constructor(id?: number, clazz?: string, school?: School) {
      this.id = id as number;
      this.clazz = clazz as string;
      this.school = school as School;
    }
}
