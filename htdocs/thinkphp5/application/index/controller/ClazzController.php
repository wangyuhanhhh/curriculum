<?php
namespace app\index\controller;
use think\Request;
use app\common\model\Clazz;
use app\common\validate\ClazzValidate;

class ClazzController extends IndexController {
    public static function getClazz() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => false, 'message' => 'id不存在']);
        }
        $clazz = Clazz::get($id);
        return $clazz;
    }
     /**
     * 新增
     */
    public function add() {
        // 获取JSON数据
        $content = Request::instance()->getContent();
        // 解析数据
        $data = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $success = false;
            $message = '无效的json数据';
            return json(['success' => $success, 'message' => $message]);
        }
        $validate = new ClazzValidate();
        if ($validate->check($data)) {
            $clazz = new Clazz();
            $clazz->clazz = $data['clazz'];
            $clazz->school_id = $data['school_id'];
            // 检查班级名称是不是以“班”为结尾
            if ($this->endChar($data['clazz'])) {
                // 查重
                if ($this->checkRepeat($clazz, $data['clazz'], $data['school_id'])) {
                    if ($clazz->save()) {
                        $success = true;
                        $message = '新增成功';
                        return json(['success' => $success, 'message' => $message]);
                    } else {
                        $success = false;
                        $message = '新增失败';
                        return json(['success' => $success, 'message' => $message]);
                    }
                } else {
                    // 数据已经存在
                    $success = false;
                    $message = '该班级已存在';
                    return json(['success' => $success, 'message' => $message]);
                }
            } else {
                $success = false;
                $message = "班级名称必须以“班”为结尾";
                return json(['success' => $success, 'message' => $message]);
            }

        } else {
            // 验证失败，返回错误信息
            $success = false;
            $message = $validate->getError();
            return json(['success' => $success, 'message' => $message]);
        }
    }

    /**
     * 在数据库中查重
     * @return boolean
     */
    public function checkRepeat(Clazz $Clazz, $clazz, $school_id) {
        // 使用where方法查询
        $result = $Clazz->where([
            'clazz' => $clazz,
            'school_id' => $school_id
        ]) -> find();

        // 判断查询结果是否为空 结果为空，返回true
        return $result == null;
    }

    /**
     * 根据id获取对应的班级信息
     */
    public function edit() {
        $clazz = ClazzController::getClazz();
        $clazzJson = json_encode($clazz, JSON_UNESCAPED_UNICODE);
        return $clazzJson;
    }
    /**
     * 检查班级名称是否以“班”为结尾，班级名称必须是“大数据2301班”这种形式
     * @return boolean
     */
    public function endChar($string) {
        $lastChar = mb_substr($string, -1);
        // 是“班”则返回true
        return $lastChar === '班';
    }

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

    /**
     * 更新班级信息
     */
    public function update() {
        // 获取数据
        $content = Request::instance()->getContent();
        $data = json_decode($content, true);
        // 验证（validate， endChar checkRepeat)
        $validate = new ClazzValidate();
        if ($validate->check($data)){
            // 获取原班级信息
            $clazz = ClazzController::getClazz();
            $clazz->clazz = $data['clazz'];
            $clazz->school_id = $data['school_id'];
            // 检查班级名称是否合法
            if ($this->endChar($data['clazz'])) {
                // 查重
                if ($this->checkRepeat($clazz, $data['clazz'], $data['school_id'])) {
                    if ($clazz->save()) {
                        return json(['success' => true, 'message' => '编辑成功']);
                    } else {
                        return json(['success' => false, 'message' => '编辑失败']);
                    }
                } else {
                    return json(['success' => false, 'message' => '该班级已存在']);
                }
            } else {
                return json(['success' => false, 'message' => '班级名称必须以“班”为结尾']);
            }
        } else {
            return json(['success' => false, 'message' => $validate->getError()]);
        }
        // 保存
    }
}