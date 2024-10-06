<?php
namespace app\common\validate;
use think\Validate;

class SchoolValidate extends Validate {
    protected $rule = [
        'school' => 'require'
    ];
    protected $message = [
        'school.require' => '学校名称不能为空'
    ];
}