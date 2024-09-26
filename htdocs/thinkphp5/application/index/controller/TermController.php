<?php
namespace app\index\controller;
use think\Request;
use app\common\model\Term;
use think\Controller;

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
        $startTime = (int)($data['start_time'] / 1000);  
        $endTime = (int)($data['end_time'] / 1000); // 如果 end_time 也是毫秒级时间戳的话  

        $term = new Term;
        $term->start_time = date('Y-m-d', $startTime); 
        $term->end_time = date('Y-m-d', $endTime); 
        $term->term = $data['term'];
        $term->status = $data['status'];
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