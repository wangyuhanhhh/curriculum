<?php
namespace app\index\controller;

use app\common\model\User;
use app\common\model\Teacher;
use app\common\model\Student;
use think\Request;

class LoginController extends IndexController {

    protected $beforeActionList = [
        'checkAuth' => ['except' => 'login'],   // 除了 login 登录方法，对其他所有方法都生效
    ];

    protected $afterActionList = [
        'addTokenToResponse' => ['except' => 'logout'],  // 除了 logout 方法，对其他的所有方法生效
    ];

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
            return json(['success' => false, 'message' => '用户不存在，登录失败']);
        } else {
            $student = Student::where('user_id', $user->id)->find();
            // 判断是否冻结
            if ($student->status == 0) {
                return json(['success' => false, 'message' => '该用户被冻结，登录失败']);
            }
        }

        if ($password != $user->password) {
            return json(['success' => false, 'message' => '密码错误，登录失败']);
        }

        // 获取当前登录用户的姓名
        if ($user->role == 3) {
            // 角色为 3 ，即该登录用户为学生
            $query = Student::where('user_id', $user->id)->find();
            // 学号或者工号
            $no = $query->student_no;

        } else {
            $query = Teacher::where('user_id', $user->id)->find();
            $no = $query->teacher_no;
        }

        // 将登录用户的信息返回给前台
        $loginUser = [
            'id' => $user->id,  // 注意，这里返回的是 user 表的 id
            'username' => $user->username,
            'role'  => $user->role,
            'name' => $query->name,
            'no' => $no,
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

    public function logout() {
        // 获取请求头中的 x-auth-token
        $request = Request::instance();
        $xAuthToken = $request->header('x-auth-token');

        // 检查 token 是否存在
        if (empty($xAuthToken) || !session($xAuthToken)) {
            return json(['success' => false, 'message' => '未找到有效会话']);
        }

        // 删除 session 中的 token
        session(null);

        return json(['success' => true, 'message' => '登出成功']);
    }
}
