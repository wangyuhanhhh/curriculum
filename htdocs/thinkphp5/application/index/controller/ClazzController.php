<?php
namespace app\index\controller;
use app\index\controller\IndexController;
use app\common\model\Clazz;
use think\Request;
use app\common\validate\ClazzValidate;

class ClazzController extends IndexController {
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
        if ($validate->scene('add')->check($data)) {
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
                        $message = '新增失败111111';
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
}