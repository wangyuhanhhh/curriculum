<?php
namespace app\common\model;
use think\Model;

class Student extends Model
{
    // // 用户名
    // private $username;

    // // 密码（通常应该加密存储）
    // private $password;

    // // 构造函数
    // public function __construct()
    // {
    // }

    // public function getUsername()
    // {
    //     return $this->username;
    // }

    // public function setUsername($username)
    // {
    //     $this->username = $username;
    // }

    // public function getPassword()
    // {
    //     return $this->password;
    // }

    // public function setPassword($password)
    // {
    //     $this->password = $password;
    // }

    // public function toArray()
    // {
    //     return [
    //         'username' => $this->username,
    //         'password' => $this->password,
    //     ];
    // }
    // 一对一关联Clazz
    public function clazz() {
        return $this->belongsTo('Clazz', 'clazz_id', 'id');
    }

    public function user() {
        return $this->belongsTo('User', 'user_id', 'id');
    }
}
