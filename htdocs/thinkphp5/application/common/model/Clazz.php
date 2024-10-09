<?php
namespace app\common\model;
use think\Model;

class Clazz extends Model {
    // 定义与student表的关联关系
    public function students() {
        return $this->hasMany('Student', 'clazz_id', 'id');
    }
}