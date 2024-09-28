<?php
namespace app\index\controller;
use think\Request;
use app\common\model\Term;
use think\Controller;
use app\common\validate\TermValidate;

class TermController extends Controller
{
    // 显示学期列表
    public function index() {
        $Term = new Term;
        $totalTerm = Term::select();
        return json($totalTerm);
    }
    
    // 新增学期
    public function add(){
        // 接收前台数据
        $request = Request::instance()->getContent();
        $data = json_decode($request, true);
  
        // 将毫秒级时间戳转换为秒级时间戳  
        $startTimeStamp = (int)($data['startTime'] / 1000);  
        $endTimeStamp = (int)($data['endTime'] / 1000); // 如果 endTime 也是毫秒级时间戳的话  

        $term = new Term;
        $term->start_time = date('Y-m-d', $startTimeStamp); 
        $term->end_time = date('Y-m-d', $endTimeStamp); 
        $term->term = $data['term'];
        $term->status = $data['status'];
        $term->school_id = $data['schoolId'];

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
}