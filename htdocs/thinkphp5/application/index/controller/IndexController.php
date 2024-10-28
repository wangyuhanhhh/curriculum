<?php
namespace app\index\controller;
use think\Controller;
use think\Request;

class IndexController extends Controller {

        // 配置前置方法
        protected $beforeActionList = [
            'checkAuth' => ['*'],
        ];

        // 前置方法，用于身份验证
        public function checkAuth() {
            $request = Request::instance();
            $xAuthToken = $request->header('X-Auth-Token');

            if (empty($xAuthToken) || !session($xAuthToken)) {
                // 返回 401 未授权响应
                exit(json_encode(['success' => false, 'message' => '未授权'], 401));
            }
        }

    // 定义后置方法
    protected $afterActionList = [
        'addTokenToResponse' => ['*'],
    ];

    public function addTokenToResponse() {
        $request = Request::instance();
        $xAuthToken = $request->header('X-Auth-Token');

        // 如果存在 x-auth-token ， 则将它添加到响应头中
        if (empty($xAuthToken)) {
            header('x-auth-token:' . $xAuthToken);
        }
    }

    public static function getParamId($request) {
        $path = $request->path();
        // 用/作为分割符，分割字符串
        $parts = explode('/', $path);
        // 获取数组中的最后一个元素
        return (int)end($parts);
    }
}
