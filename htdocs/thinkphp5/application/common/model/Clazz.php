<?php
namespace app\common\model;
use think\Model;

class Clazz extends Model {

    public function students() {
        return $this->hasMany('Student', 'clazz_id', 'id');
    }

    public function school() {
        return $this->belongsTo('School', 'school_id', 'id');
    }
}