<?php
namespace app\index\model;
class User
{
    // 用户名
    private $username;

    // 密码（通常应该加密存储）
    private $password;

    // 构造函数
    public function __construct()
    {
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function setUsername($username)
    {
        $this->username = $username;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function setPassword($password)
    {
        $this->password = $password;
    }

    public function toArray()
    {
        return [
            'username' => $this->username,
            'password' => $this->password,
        ];
    }
}
