<?php
namespace app\common\validate;
use think\Validate;

class StudentValidate extends Validate
{
    protected $rule = [
        'name' => 'require',
        'password' => 'require',
        'status' => 'require',
        'student_no' => 'require',
        'clazz_no' => 'require',
    ];

    // 定义错误信息
    protected $message = [
        'name.require' => '姓名不能为空',
        'password' => '密码默认设置失败',
        'status' => '状态默认激活失败',
        'student_on' => '学号不能为空',
        'clazz_no' => '该学生必须有所属班级',
    ];

    // 定义场景
    protected $scene = [
        'add' => ['name', 'password', 'status', 'student_no', 'clazz_no'],
    ];
}