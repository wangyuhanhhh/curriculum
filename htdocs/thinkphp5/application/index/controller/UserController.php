<?php
namespace app\index\controller;
use app\common\model\User;
use think\Controller;
use think\Request;

class UserController extends IndexController {
    public function changePassword() {
        // 从 session 中获取当前登录用户的 id
        $id = $this->getSessionUserId();
        $oldPassword = input('oldPassword', '', 'trim');
        $newPassword = input('newPassword', '', 'trim');

        // 验证输入
        if (empty($oldPassword) || empty($newPassword)) {
            return json(['success' => false, 'message' => '请输入旧密码和新密码']);
        }

        // 获取数据库中对应 旧密码；判断是否正确
        $password = User::where('id', $id)->value('password');

        if ($oldPassword !== $password) {
            return json(['success' => false, 'message' => '旧密码错误']);
        }

        // 更新密码
        $updateResult = User::where('id', $id)->update(['password' => $newPassword]);

        // 返回响应
        if ($updateResult) {
            return json(['success' => true, 'message' => '密码修改成功']);
        } else {
            return json(['success' => false, 'message' => '密码修改失败']);
        }
    }

    /**
     * 从 session 中获取当前登录用户的 id
     * @return $id
     */
    public function getSessionUserId() {
        // 从请求头中获取 x-auth-token
        $request = Request::instance();
        $sessionId = $request->header('x-auth-token');

        // 从 session 中获取储存的用户信息
        $userInfoJson = session($sessionId);
        if (empty($userInfoJson)) {
            return json(['success' => false, 'message' => '会话已过期']);
        }

        // 将 JSON 字符串解析为数组
        $userInfo = json_decode($userInfoJson, true);

        if (empty($userInfo) || !isset($userInfo['id'])) {
            return json(['success' => false, 'message' => '无法获取用户信息']);
        }

        // 获取用户的 id
        $userId = $userInfo['id'];
        return $userId;
    }
}