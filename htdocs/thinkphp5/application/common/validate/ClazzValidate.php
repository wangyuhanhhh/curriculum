<?php
namespace app\common\validate;
use think\Validate;

class ClazzValidate extends Validate {
    // 验证规则
    protected $rule = [
        'clazz' => 'require',
        'school_id' => 'require|integer|gt:0', // school_id必须大于0
        'teacher_id' => 'require|integer|gt:0'
    ];
    // 定制提示信息
    protected $message = [
        'clazz.require' => '班级名称不能为空',
        'school_id.require' => '必须选择一个学校',
        'school_id.integer' => '学校ID必须是整数',
        'school_id.gt' => '学校ID必须大于0',
        'teacher_id.require' => '必须选择一名教师',
        'teacher_id.integer' => '教师ID必须是整数',
        'teacher_id.gt' => '教师ID必须大于0'
    ];
    // 验证场景
    protected $scene = [
        'add' => ['clazz', 'school_id'],
        'edit' => ['clazz', 'school_id'],
        'saveTeacher' => ['teacher_id'],
    ];
}