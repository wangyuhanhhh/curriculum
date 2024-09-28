<?php
namespace app\common\validate;
use think\Validate;

class TermValidate extends Validate
{
    // 定义验证规则
    protected $rule = [
        'start_time' => 'require',
        'end_time' => 'require',
        'term' => 'require',
        'status' => 'require',
        'school_id' => 'require|integer|gt:0' // school_id必须是大于0的整数
    ];

    // 定义错误信息
    protected $message = [
        'start_time.require' => '开始时间不能为空',
        'end_time.require' => '结束时间不能为空',
        'term.require' => '学期名称不能为空',
        'status.require' => '必须选择学期状态',
        'school_id.require' => '必须选择一个学校',  
        'school_id.integer' => '学校ID必须是整数',  
        'school_id.gt' => '学校ID必须大于0',
    ];

    // 定义验证场景
    protected $scene = [
        'add' => ['start_time', 'end_time', 'term', 'status', 'school_id'],
    ];
}