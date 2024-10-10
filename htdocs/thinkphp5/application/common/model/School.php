<?php
namespace app\common\model;
use think\Model;

class School extends Model {
    // 一个学校有多个班级
    public function clazzes() {
        return $this->hasMany('Clazz', 'school_id', 'id');
    }
    // 一个学校有多个学期
    public function terms() 
    {
        return $this->hsaMany('Term');
    }
}