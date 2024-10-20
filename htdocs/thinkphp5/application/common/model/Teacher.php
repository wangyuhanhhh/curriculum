<?php
namespace app\common\model;
use think\Model;

class Teacher extends Model {
    public function clazzes() {
        return $this->hasMany('Clazz', 'teacher_id', 'id');
    }
    public function user() {
        return $this->belongsTo('User', 'user_id', 'id');
    }
}