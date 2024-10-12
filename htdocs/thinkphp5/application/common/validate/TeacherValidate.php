<?php
namespace app\common\validate;
use think\Validate;

class TeacherValidate extends Validate {
    protected $rule = [
        'name' => 'require',
        'teacher_no' => 'require',
        'user_id' => 'require',
        'password' => 'require',
        'username' => 'require',
        'role' => 'require',
    ];

    protected $message = [
        'name.require' => '姓名不能为空',
        'teacher_no' => '工号不能为空',
        'user_id' => 'user_id设置错误',
        'password' => '密码默认设置失败',
        'username' => '用户名不能为空',
        'role' => '角色默认设置失败',
    ];

    //  设置场景
    protected $scene = [
        'addUser' => ['username', 'password', 'role'],
        'addTeacher' => ['name', 'teacher_no', 'user_id'],
    ];
}