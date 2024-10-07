<?php
namespace app\index\controller;
use app\common\model\Student;
use app\common\validate\StudentValidate;
use think\Request;
use think\Db;

class StudentController extends IndexController
{
    public function index() {
      $Student = new Student;
      $totalStudent = Student::select();
      return json($totalStudent);
      // return '<style type="text/css">*{ padding: 0; margin: 0; } .think_default_text{ padding: 4px 48px;} a{color:#2E5CD5;cursor: pointer;text-decoration: none} a:hover{text-decoration:underline; } body{ background: #fff; font-family: "Century Gothic","Microsoft yahei"; color: #333;font-size:18px} h1{ font-size: 100px; font-weight: normal; margin-bottom: 12px; } p{ line-height: 1.6em; font-size: 42px }</style><div style="padding: 24px 48px;"> <h1>:)</h1><p> ThinkPHP V5<br/><span style="font-size:30px">十年磨一剑 - 为API开发设计的高性能框架</span></p><span style="font-size:22px;">[ V5.0 版本由 <a href="http://www.qiniu.com" target="qiniu">七牛云</a> 独家赞助发布 ]</span></div><script type="text/javascript" src="http://tajs.qq.com/stats?sId=9347272" charset="UTF-8"></script><script type="text/javascript" src="http://ad.topthink.com/Public/static/client.js"></script><thinkad id="ad_bd568ce7058a1091"></thinkad>';
    }

    public function login() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
          // 从解析后的数据中获取 username 和 password
        $username = isset($parsedData['username']) ? $parsedData['username'] : null;
        $password = isset($parsedData['password']) ? $parsedData['password'] : null;
        $user = new User();

        $user->setUsername($username);
        $user->setPassword($password);
        return json($user->toArray());
    }

    public function add() {
      // 接收前台数据
      $request = Request::instance()->getContent();
      $data = json_decode($request, true);

      // 查重
      $studentNo = $data['student_no'];
      $students = Student::where('student_no', $studentNo)->find();

      if($students){
          return json(['success' => false, 'message' => '该学号学生已存在，新增失败']);
      }

      // 给默认密码（学号）
      $student = new Student;
      $student->name = $data['name'];
      $student->password = $studentNo;
      $student->status = 1;
      $student->student_no = $studentNo;
      $student->clazz_id = $data['clazz_id'];

      // 数据校验
      $validate = new StudentValidate;
      if(!$validate->scene('add')->check($data)){
          // 验证失败，返回错误信息
          return json(['success' => false, 'message' => $validate->getError()]);
      }
      // 验证通过，处理数据
      $result = $student->save();
      if($result) {
          return json(['success' => true, 'message' => '新增成功']);
      } else {
          return json(['success' => false, 'message' => '新增失败']);
      }
    }
}

