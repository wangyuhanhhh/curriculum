<?php
namespace app\common\model;
use think\Model;

class Clazz extends Model {
    public function courses() {
        return $this->hasMany('Course', 'clazz_id', 'id');
    }

    public function students() {
        return $this->hasMany('Student', 'clazz_id', 'id');
    }

    public function school() {
        return $this->belongsTo('School', 'school_id', 'id');
    }

    public function teacher() {
        return $this->belongsTo('Teacher', 'teacher_id', 'id');
    }
}