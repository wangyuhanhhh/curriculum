<?php
namespace app\common\model;
use think\Model;

class Term extends Model
{
    public function school() {
        return $this->belongsTo('School', 'school_id', 'id');
    }
}