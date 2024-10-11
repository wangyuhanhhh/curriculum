<?php
namespace app\index\controller;
use app\common\model\Teacher;
use think\Request;

class TeacherController extends IndexController {
    public function index() {
        $totalTeacher = Teacher::select();
        return json($totalTeacher);
    }
}