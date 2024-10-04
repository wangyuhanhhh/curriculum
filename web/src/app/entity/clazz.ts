/**
 * 班级
 */
export class Clazz {
    id: number;
    clazz: string;
    school_id: number;
    constructor(id?: number, clazz?: string, school_id?: number) {
      this.id = id as number;
      this.clazz = clazz as string;
      this.school_id = school_id as number;
    }
  }
  