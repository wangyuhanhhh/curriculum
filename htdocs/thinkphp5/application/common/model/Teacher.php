<?php
namespace app\common\model;
use think\Model;

class Teacher extends Model {
    public function user() {
        return $this->hasOne('user', 'user_id', 'id');
    }
}