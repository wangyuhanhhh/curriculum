<?php
namespace app\index\controller;
use app\common\model\School;
use think\Request;
use think\Db;
use app\common\validate\SchoolValidate;

class SchoolController extends IndexController {
    public static function getSchool() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => false, 'message' => 'id不存在']);
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
            $success = false;
            $message = '无效的json数据';
            return json(['success' => $success, 'message' => $message]);
        }
        // 验证数据
        $validate = new SchoolValidate();
        if ($validate -> check($parsedData)) {
            // 检查$parsedData是否被正确解析并且包含'school'键
            if (is_array($parsedData) && isset($parsedData['school'])) {
                // 接收到的学校名
                $schoolName = $parsedData['school'];
                // 检查数据是否已经存在
                $isExist = School::where('school', $schoolName)->find();
                if ($isExist) {
                    $success = false;
                    $message = '学校已存在';
                    return json(['success' => $success, 'message' => $message]);
                } else {
                    $School->school = $schoolName;
                    if ($School->save()) {
                        $success = true;
                        $message = '新增成功';
                        return json(['success' => $success, 'message' => $message]);
                    } else {
                        $success = false;
                        $message = '新增失败';
                        return json(['success' => $success, 'message' => $message]);
                    }
                }
            }
        } else {
            $success = false;
            $message = $validate->getError();
            return json(['success' => $success, 'message' => $message]);
        }
    }

    public function delete() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        // 查询id对应的学校信息，同时查询该学校对应的班级信息
        $school = School::with('clazzes')->find($id);
        // id没有学校信息
        if (!$school) {
            $success = false;
            $message = '学校不存在';
            return json(['success' => $success, 'message' => $message]);
        }
        // 学校下存在班级
        if (!empty($school->clazzes)) {
            return json(['success' => false, 'message' => '该学校有班级，无法删除']);
        }
        // 删除
        if ($school->delete()) {
            $success = true;
            $message = '删除成功';
            return json(['success' => $success, 'message' => $message]);
        } else {
            $success = false;
            $message = '删除失败';
            return json(['success' => $success, 'message' => $message]);
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

    /**
     * 分页搜索
     */
    public function search() {
        // 获取前端的查询参数
        $name = input('name', '', 'trim');
        $size = Request::instance()->get('size', 5);
        $currentPage = Request::instance()->get('currentPage', 1);

        // 构建查询条件
        $query = Db::name('school');

        if (!empty($name)) {
            $query->where('school', 'like', '%' . $name . '%');
        }

        // 克隆查询对象，计算查询总记录数
        $countQuery = clone $query;
        $total = $countQuery->count();

        // 计算偏移量
        $offset = ($currentPage - 1) * $size;

        // 查询当前页的数据
        $data = $query->limit($offset, $size)->select();

        // 构造分页结果
        $result = [
            'content' => $data,
            'number' => $currentPage,
            'size' => $size,
            'numberOfElements' => $total,
            'totalPages' => ceil($total / $size),
        ];

        return json($result);
    }
    
    // 更新数据
    public function update() {
        // 获取数据
        $content = Request::instance()->getContent();
        $parsedData = json_decode($content, true);
        $validate = new SchoolValidate();
        if ($validate -> check($parsedData)) {
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
                    $success = true;
                    $message = '编辑成功';
                    return json(['success' => $success, 'message' => $message]);
                } else {
                    $success = false;
                    $message = '编辑失败请重试';
                    return json(['success' => $success, 'message' => $message]);
                }
            }
        } else {
            return json(['success' => false, 'message' => $validate->getError()]);
        }
    }
}
