<?php
namespace app\index\controller;
use think\Request;
use app\common\model\Term;
use think\Controller;

class TermController extends Controller
{
    public function index() {
         $Term = new Term;
         $totalTerm = Term::select();
        return json($totalTerm);
    }
    
    // 新增学期
    public function add(Request $request){
        // 接收前台数据
        // 数据校验
        // 数据库新增操作
    }

    // 修改学期
    public function edit(Request $request){

    }

    // 冻结学期
    public function freeze(Request $request){

    }

    // 显示学期列表

}