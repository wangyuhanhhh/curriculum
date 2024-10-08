<?php
namespace app\index\controller;
use app\common\model\Student;
use app\common\validate\StudentValidate;
use think\Request;
use think\Db;

class StudentController extends IndexController
{
    public function login() {
        // 解析 JSON 数据
        $parsedData = json_decode(Request::instance()->getContent(), true);
          // 从解析后的数据中获取 username 和 password
        $username = isset($parsedData['username']) ? $parsedData['username'] : null;
        $password = isset($parsedData['password']) ? $parsedData['password'] : null;
        $user = new Student();

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
      // 验证成功，$validate = new StudentValidate 值为false
      if($validate->scene('add')->check($data)){
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

    public function delete() {
        $student = StudentController::getStudent();
        if (!$student) {
            return json(['success' => false, 'message' => '该学生不存在']);
        }

        if ($student->delete()) {
            return json(['success' => true, 'message' => '删除成功']);
        } else {
            return json(['success' => false, 'message' => '删除失败']);
        }
    }

    // 根据id获取对应学生信息
    public function edit() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if(!$id) {
            return (['success' => false, 'message' => '该学生不存在']);
        }
        $studentData = Student::with('clazz')->find($id);
        $schoolId = $studentData->clazz->school_id;
        $studentData->school_id = $schoolId;
        // 重新整合为一个新的数组
        // 因为不需要全部的字段，只需要 name, student_no, clazz_id, school_id
        $student['name'] = $studentData->name;
        $student['student_no'] = $studentData->student_no;
        $student['clazz_id'] = $studentData->clazz_id;
        $student['school_id'] = $schoolId;
        return json($student);
    }

    public static function getStudent() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => false, 'message' => 'id不存在']);
        }
        $student = Student::get($id);
        return $student;
    }

    public function freeze() {
        $request = Request::instance();
        // 获取对应数据的id
        $id = IndexController::getParamId($request);
        $student = Student::get($id);
        // 判断被操作的学生是激活状态
        if ($student->status) {
            // 是激活状态，则冻结（置0）
            $student->status = 0;
        } else {
            return json(['success' => false, 'message' => '冻结失败！']);
        }

        if ($student->save()) {
            return json(['success' => true, 'message' => '冻结成功']);
        } else {
            return json(['success' => false, 'message' => '冻结失败']);
        }
    }

    public function index() {
        $Student = new Student;
        $totalStudent = Student::select();
        return json($totalStudent);
        // return '<style type="text/css">*{ padding: 0; margin: 0; } .think_default_text{ padding: 4px 48px;} a{color:#2E5CD5;cursor: pointer;text-decoration: none} a:hover{text-decoration:underline; } body{ background: #fff; font-family: "Century Gothic","Microsoft yahei"; color: #333;font-size:18px} h1{ font-size: 100px; font-weight: normal; margin-bottom: 12px; } p{ line-height: 1.6em; font-size: 42px }</style><div style="padding: 24px 48px;"> <h1>:)</h1><p> ThinkPHP V5<br/><span style="font-size:30px">十年磨一剑 - 为API开发设计的高性能框架</span></p><span style="font-size:22px;">[ V5.0 版本由 <a href="http://www.qiniu.com" target="qiniu">七牛云</a> 独家赞助发布 ]</span></div><script type="text/javascript" src="http://tajs.qq.com/stats?sId=9347272" charset="UTF-8"></script><script type="text/javascript" src="http://ad.topthink.com/Public/static/client.js"></script><thinkad id="ad_bd568ce7058a1091"></thinkad>';
    }

    //跟新学生信息
    public function update() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        // 当前被修改的学生信息
        $student = Student::get($id);
        $data = Request::instance()->getContent();
        $studentData = json_decode($data, true);

        // 获取前台传过来的 student_no
        // 如果修改了学生的student_no（学号），则判断是否重复，学号不允许重复
        $studentNo = $studentData['student_no'];

        if($student->student_no !== $studentNo){
            $students = Student::where('student_no', $studentNo)->find();
            if($students){
                return json(['success' => false, 'message' => '该学号已被使用，编辑失败']);
            }
        }

        // 比较各字段是否有改动
        $noChange = true;
        if ($student->name !== $studentData['name']) {
            $noChange = false;
        }
        if ($student->student_no !== $studentData['student_no']) {
            $noChange = false;
        }
        if ($student->clazz_id !== $studentData['clazz_id']) {
            $noChange = false;
        }

        // 如果没有任何改动，返回 false
        if ($noChange) {
            return json(['success' => false, 'message' => '没有任何改动，更新失败']);
        }

        $student->name = isset($studentData['name']) ? $studentData['name'] : $student->name;
        $student->student_no = isset($studentData['student_no']) ? $studentData['student_no'] : $student->student_no;
        $student->clazz_id = isset($studentData['clazz_id']) ? $studentData['clazz_id'] : $student->clazz_id;

        $validate = new StudentValidate;
        if(!$validate->scene('update')->check($studentData)){
            return json(['success' => false, 'message' => $validate->getError()]);
        }
        // 验证通过，处理数据
        $result = $student->save();
        if($result) {
            return json(['success' => true, 'message' => '编辑成功']);
        } else {
            return json(['success' => false, 'message' => '编辑失败']);
        }

    }
}

