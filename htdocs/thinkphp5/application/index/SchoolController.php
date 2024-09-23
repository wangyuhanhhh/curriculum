<?php
namespace app\common\controller;
use think\Controller;
use app\index\model\School;
use think\Request;

class SchoolController extends Controller {
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
        return json(['success' => false, 'error' => '缺少学校数据']);
    }
    public function index() {
        $schoolModel = new School();
        // 获取所有学校集合
        $schools = $schoolModel -> select();
        // 转换成JSON字符串 JSON_UNESCAPED_UNICODE避免中文字符被转义
        $schoolJson = json_encode($schools, JSON_UNESCAPED_UNICODE);
        var_dump($schoolJson);
        die();
        return $schoolJson;
    }
}
