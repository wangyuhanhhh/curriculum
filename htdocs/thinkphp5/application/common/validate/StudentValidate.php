<?php
namespace app\common\validate;
use think\Validate;

class StudentValidate extends Validate
{
    protected $rule = [
        'name' => 'require',
        'username' => 'require',
        'password' => 'require',
        'status' => 'require',
        'role' => 'require',
        'student_no' => 'require',
        'clazz_no' => 'require',
        'user_id' => 'require',
    ];

    // 定义错误信息
    protected $message = [
        'name.require' => '姓名不能为空',
        'username.require' => '用户名不能为空',
        'password.require' => '密码默认设置失败',
        'status.require' => '状态默认激活失败',
        'role.require' => '角色默认设置失败',
        'student_no.require' => '学号不能为空',
        'clazz_id.require' => '该学生必须有所属班级',
        'user_id.require' => 'user_id设置错误',
    ];

    // 定义场景
    protected $scene = [
        'addUser' => ['username', 'password', 'role'],
        'addStudent' => ['name', 'status', 'student_no', 'clazz_id', 'user_id'],
        'update' => ['name', 'student_no', 'clazz_id'],
    ];
}