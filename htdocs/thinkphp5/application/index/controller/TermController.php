<?php
namespace app\index\controller;
use think\Db;
use think\Request;
use app\common\model\Term;use think\Controller;
use app\common\validate\TermValidate;

class TermController extends IndexController
{
    // 学期激活
    public function active() {
        $request = Request::instance();
        // 获取对应数据的id
        $id = IndexController::getParamId($request);
        $data = Request::instance()->getContent();
        $needChangeTerm = Term::get($id);
        $schoolId = $needChangeTerm->school_id;
        $condition = [];
        $condition['school_id'] = $schoolId;
        $terms = Term::where($condition)->select();  // 获取指定字段的记录
        if (is_array($terms)) {
            foreach ($terms as $term) {
                $term->status = 0;
                $term->save();
            }
        } else {
            echo '没有找到符合条件的记录';
        }
        $needChangeTerm->status = 1;

        if ($needChangeTerm->save()) {
            return json(['success' => true, 'message' => '激活成功']);
        } else {
            return json(['success' => false, 'message' => '激活失败']);
        }
    }

    // 新增学期
    public function add() {
        // 接收前台数据
        $request = Request::instance()->getContent();
        $data = json_decode($request, true);
  
        // 将毫秒级时间戳转换为秒级时间戳  
        $startTimeStamp = (int)($data['start_time'] / 1000);  
        $endTimeStamp = (int)($data['end_time'] / 1000); // 如果 endTime 也是毫秒级时间戳的话  

        $term = new Term;
        $term->start_time = date('Y-m-d', $startTimeStamp); 
        $term->end_time = date('Y-m-d', $endTimeStamp); 
        $term->term = $data['term'];
        //新增学期，状态默认为冻结状态（0）
        $term->status = 0;
        $term->school_id = $data['school_id'];

        // 实例化验证器
        $validate = new TermValidate;
        // 进行数据验证
        if(!$validate->scene('add')->check($term)) {
            // 验证失败，返回错误信息
            $success = false;
            $message = $validate->getError();
            return json([
                'success' => $success,
                'message' => $message
            ]);
        }
        // 验证通过，处理数据
        $result = $term->save();

        if($result) {
            $success = true;
            $message = '学期新增成功';

            // 返回json响应
            return json([
                'success' => $success,
                'message' => $message
            ]);
        } else {
            $success = false;
            $message = '学期新增失败';
            
            return json([
                'success' => $success,
                'message' => $message
            ]);
        }
    }

    // 根据id获取学期信息，用来显示编辑前的信息，填充表单
    public function edit() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if(!$id) {
            return (['success' => true, 'message' => '该学期不存在']);
        }
        $term = Term::get($id);
        return json($term);
    }

    // 显示学期列表
    public function index() {
        $Term = new Term;
        $totalTerm = Term::select();
        return json($totalTerm);
    }

    // 更新学期
    public function update() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        $data = Request::instance()->getContent();
        $newTerm = json_decode($data, true);
        $term = Term::get($id);

        if(!$term) {
            return json(['success' => false, 'message' => '学期不存在']);
        }

        // 比较各字段是否有改动
        $noChange = true;
        if ($term->term !== $newTerm['term']) {
            $noChange = false;
        }
        if ($term->school_id !== $newTerm['school_id']) {
            $noChange = false;
        }
        if ($term->start_time !== $newTerm['start_time']) {
            $noChange = false;
        }
        if ($term->end_time !== $newTerm['end_time']) {
            $noChange = false;
        }

        // 如果没有任何改动，返回 false
        if ($noChange) {
            return json(['success' => false, 'message' => '没有任何改动，更新失败']);
        }

        // 判断start_time和end_time是否需要转化类型
        // 如果改动了start_time和end_time就需要转化类型
        if (ctype_digit($newTerm['start_time'])) {
            $startTimeStamp = (int)($newTerm['start_time'] / 1000);
            $term->start_time = date('Y-m-d', $startTimeStamp);  
        } else {
            // 不需要转型，则直接赋值
            $term->start_time = $term->start_time;
        }
        if (ctype_digit($newTerm['end_time'])) {
            $endTimeStamp = (int)($newTerm['end_time'] / 1000);
            $term->end_time = date('Y-m-d', $endTimeStamp);  
        } else {
            $term->end_time = $term->end_time;
        }

        $term->term = isset($newTerm['term']) ? $newTerm['term'] : $term->term;
        $term->school_id = isset($newTerm['school_id']) ? $newTerm['school_id'] : $term->school_id;

        // 保存更新
        if ($term->save()) {
            return json(['success' => true, 'message' => '学期更新成功']);
        } else {
            return json(['success' => false, 'message' => '学期更新失败']);
        }
    }
}