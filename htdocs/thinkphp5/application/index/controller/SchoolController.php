<?php
namespace app\index\controller;
use app\common\model\School;
use think\Request;
use app\common\validate\SchoolValidator;

class SchoolController extends IndexController {
    public static function getSchool() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => true, 'message' => 'id不存在']);
        }
        $school = School::get($id);
        return $school;
    }

    /**
     * 接受数据并执行新增操作
     */
    public function add() {
        // 获取并解析JSON数据
        $content = Request::instance()->getContent();
        $parsedData = json_decode($content, true);
        $School = new School();
        if (json_last_error() !== JSON_ERROR_NONE) {
            return json(['success' => false, 'error' => '无效的json数据']);
        }
        // 验证数据
        $validator = new SchoolValidator();
        if ($validator -> check($parsedData)) {
            // 检查$parsedData是否被正确解析并且包含'school'键
            if (is_array($parsedData) && isset($parsedData['school'])) {
                // 接收到的学校名
                $schoolName = $parsedData['school'];
                $School->school = $schoolName;
                if ($School->save()) {
                    return json(['success' => true]);
                } else {
                    return json(['success' => false]);
                }
            }
        } else {
            return json(['success' => false, 'error' => $validator->getError()]);
        }
        
        return json(['success' => false, 'error' => '缺少学校数据']);
    }

    public function delete() {
        $school = SchoolController::getSchool();
        if (!$school) {
            return json(['code' => 404, 'msg' => '学校不存在']);
        }

        // 删除
        if ($school->delete()) {
            return json(['code' => 200, 'msg' => '删除成功']);
        } else {
            return json(['code' => 500, 'msg' => '删除失败']);
        }
    }

    public function edit() {
        $school = SchoolController::getSchool();
        $schoolJson = json_encode($school, JSON_UNESCAPED_UNICODE);  
        return $schoolJson;
    }
    
    public function index() {
        $schoolModel = new School();
        // 获取所有学校集合
        $schools = $schoolModel -> select();
        // 转换成JSON字符串 JSON_UNESCAPED_UNICODE避免中文字符被转义
        $schoolJson = json_encode($schools, JSON_UNESCAPED_UNICODE);
        return $schoolJson;
    }

    // 更新数据
    public function update() {
        // 获取数据
        $content = Request::instance()->getContent();
        $parsedData = json_decode($content, true);
        // 前台传过来的要进行更新的学校名
        $updateSchool = $parsedData['school'];
        // 检查数据是否已经存在，存在返回true，不存在返回false
        $isExist = School::where('school', $updateSchool) -> find();
        // 若已存在，提示前台数据已经存在
        if ($isExist) {
            return json(['success' => false, 'message' => '学校已存在']);
        } else {
        // 数据库中不存在，更新数据
            $school = SchoolController::getSchool();
            $school->school = $updateSchool;
            $result = $school->save();
            if ($result) {
                $success = true;;
                $message = '编辑成功';
                return json(['success' => $success, 'message' => $message]);
            } else {
                $success = false;
                $message = '编辑失败请重试';
                return json(['success' => $success, 'message' => $message]);
            }
        }
        
    }
}
