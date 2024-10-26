<?php
namespace app\index\controller;

use app\common\model\User;
use app\common\model\Teacher;
use app\common\model\Student;
use think\Request;

class LoginController extends IndexController {

    /**
     * 处理用户提交的登录数据
     */
    public function login() {
        //接受post信息
        $username = input('post.username', '');
        $password = input('post.password', '');

        // 验证用户名和密码是否为空
        if (empty($username) || empty($password)) {
            return json(['success' => false, 'message' => '用户名或密码不能为空']);
        }

        // 查询用户是否存在
        $user = User::where('username', $username)->find();
        if (empty($user)) {
            return json(['success' => false, 'message' => '用户不存在']);
        }

        if ($password != $user->password) {
            return json(['success' => false, 'message' => '密码错误']);
        }

        // 获取当前登录用户的姓名
        if ($user->role == 3) {
            // 角色为 3 ，即该登录用户为学生
            $query = Student::where('user_id', $user->id)->find();
        } else {
            $query = Teacher::where('user_id', $user->id)->find();
        }

        // 将登录用户的信息返回给前台
        $loginUser = [
            'username' => $user->username,
            'role'  => $user->role,
            'password' => $user->password,
            'name' => $query->name
        ];
        $jsonObject = json_encode($loginUser, JSON_UNESCAPED_UNICODE);

        $sessionId = md5(uniqid(mt_rand(), true));
        // 将 sessionId 和 对应用户消息一起存在 session 中
        session($sessionId, $jsonObject);
        // 将 sessionId 设置为 x-auth-token 响应头
        Header('x-auth-token:' . $sessionId);
        // 返回成功响应
        return json(['success' => true, 'message' => '登录成功', 'data' => $jsonObject]);
    }

    public function currentLoginUser() {
        $request = Request::instance();
        $xAuthToken = $request->header('x-auth-token');

        // 从会话中，获取到与该 x-auth-token 关联的用户信息（当前登录用户）
        $user = session($xAuthToken);
        return json(['success' => true, 'message' => '登录成功', 'data' => $user]);
    }
}
