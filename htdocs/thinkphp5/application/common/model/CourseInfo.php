<?php
namespace app\common\model;
use think\Model;

class CourseInfo extends Model {
    public function course() {
        return $this->belongsTo( 'Course', 'course_id', 'id' );
    }
}