<?php
namespace app\index\controller;
use think\Controller;

class IndexController extends Controller {
    public static function getParamId($request) {
        $path = $request->path();
        // 用/作为分割符，分割字符串
        $parts = explode('/', $path);
        // 获取数组中的最后一个元素
        return (int)end($parts);
    }
}