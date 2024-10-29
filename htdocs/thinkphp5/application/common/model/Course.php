<?php
namespace app\common\model;
use think\Model;

class Course extends Model {
    // 一个课程对应多个课程安排
    public function courseInfos() {
        return $this->hasMany('CourseInfo', 'course_id', 'id');
    }
}