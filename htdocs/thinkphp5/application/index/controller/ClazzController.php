<?php
namespace app\index\controller;
use app\index\controller\IndexController;
use app\common\model\Clazz;

class ClazzController extends IndexController {
    public function index() {
        $clazzModel = new Clazz();
        // 获取所有班级
        $clazz = $clazzModel->select();
        // 转成json字符串
        $classJson = json_encode($clazz, JSON_UNESCAPED_UNICODE);
        return $classJson;
    }
}