<?php
namespace app\index\controller;
use app\index\controller\IndexController;
use think\Request;
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

    // 根据schoolId获取班级
    public function getClazzBySchoolId() {
        $request = Request::instance();
        $schoolId = IndexController::getParamId($request);
        if(!$schoolId) {
            return (['success' => false, 'message' => '该学校id没有对应的班级']);
        }
        
        $clazzes = Clazz::where('school_id', $schoolId)->select();

        // 按json格式返回查询到的班级信息
        return json($clazzes);
    }
}