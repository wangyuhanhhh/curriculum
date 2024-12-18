<?php
namespace app\index\controller;
use app\common\model\Clazz;
use app\common\model\School;
use app\common\model\Student;
use app\common\model\Teacher;
use app\common\model\User;
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

      // 查重（学号和用户名都不能重复）
      $studentNo = $data['student_no'];
      $username = $data['username'];
      $students = Student::where('student_no', $studentNo)->find();
      $username = User::where('username', $username)->find();

      if($students) {
          return json(['success' => false, 'message' => '该学号学生已存在，新增失败']);
      }

      if ($username) {
          return json(['success' => false, 'message' => '该用户名已存在，新增失败']);
      }

      // 开启事务
      Db::startTrans();
      try {
          // 第一步，先新增 user 数据
          $user = new User();
          $user->username = $data['username'];
          // 给默认密码（学号）
          $user->password = $studentNo;
          $user->role = 3;

          // 数据校验
          $validate = new StudentValidate();
          if ($validate->scene('addUser')->check((array)$user)) {
              // 验证失败，返回错误信息
              return json(['success' => false, 'message' => $validate->getError()]);
          }

          if (!$user->save()) {
              throw new \Exception('用户创建失败');
          }

          // 第二步，新增 student 数据，并将 user 的 id 作为 user_id 储存
          $student = new Student();
          $student->name = $data['name'];
          $student->status = 1;
          $student->student_no = $studentNo;
          $student->clazz_id = $data['clazz_id'];
          $student->user_id = $user->id;

          // 数据验证
          if ($validate->scene('addStudent')->check((array)$student)) {
              // 验证失败，返回错误信息
              return json(['success' => false, 'message' => $validate->getError()]);
          }

          if (!$student->save()) {
              throw new \Exception('学生创建失败');
          }

          // 提交事务
          Db::commit();
          return json(['success' => true, 'message' => '学生用户创建成功']);
      } catch (\Exception $e) {
          // 回滚事务
          return json(['success' => false, 'message' => $e->getMessage()]);
      }
    }

    public function delete() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        $student = Student::get($id);

        if (!$student) {
            return json(['success' => false, 'message' => '该学生不存在，删除失败']);
        }

        // 开启事务
        Db::startTrans();
        try {
            // 第一步，先删除 teacher 中的数据
            Db::name('student')
                ->where('id', $id)
                ->delete();

            // 第二步，删除 user 中的数据
            Db::name('user')
                ->where('id', $student->user_id)
                ->delete();

            Db::commit();
            return json(['success' => true, 'message' => '学生用户删除成功']);
        } catch (\Exception $e) {
            Db::rollback();
            return json(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // 根据id获取对应学生信息
    public function edit() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if(!$id) {
            return (['success' => false, 'message' => '该学生不存在']);
        }
        $studentData = Student::with('clazz', 'user')->find($id);
        $schoolId = $studentData->clazz->school_id;
        $studentData->school_id = $schoolId;
        // 重新整合为一个新的数组
        // 因为不需要全部的字段，只需要 name, username, student_no, clazz_id, school_id
        $student['name'] = $studentData->name;
        $student['username'] = $studentData->user->username;
        $student['student_no'] = $studentData->student_no;
        $student['clazz_id'] = $studentData->clazz_id;
        $student['school'] = [
            'id' => $schoolId
        ];
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

    /**
     * 获取当前登录用户的role
     */
    public function getLoginUserRole($userId) {
        $user = User::where('id', $userId)->find();
        $role = $user->role;
        return $role;
    }

    /**
     * 如果当前登录用户的role是2(教师)或4(班主任),获取该用户的school_id
     * $id:user表中的id
     */
    public function getLoginUserSchoolId($userId, $role) {
        if ($role == 2 || $role == 4) {
            $schoolId = Teacher::where('user_id', $userId)->value('school_id');
            return $schoolId;
        }
        return null;
    }

    public function index()
    {
        $Student = new Student;
        $totalStudent = Student::select();
        return json($totalStudent);
    }

    // 分页查询
    public function search() {
        // 获取前台查询条件
        $name = input('name', '', 'trim');
        $studentNo = input('student_no', '', 'trim');
        $currentPage = Request::instance()->param('currentPage', 1);
        $size = Request::instance()->param('size', 5);

        // 构建查询条件
        $query = Student::with('clazz');

        // 获取当前登录用户的id(user表中的id)
        $Course = new CourseController();
        $userId = $Course->getUserIdByLoginUser();
        // 获取当前登录用户的角色
        $role = $this->getLoginUserRole($userId);
        $schoolId = $this->getLoginUserSchoolId($userId, $role);
        if ($schoolId) {
            $clazzes = Clazz::where('school_id', $schoolId)->select();
            if (!empty($clazzes)) {
                $clazzId = [];
                foreach ($clazzes as $clazz) {
                    $clazzId[] = $clazz->id;
                }
                $query->where('clazz_id', 'in', $clazzId);
            }
        }

        if (!empty($name)) {
            $query->where('name', 'like', '%' . $name . '%');
        }
        if (!empty($studentNo)) {
            $query->where('student_no', 'like', '%' . $studentNo . '%');
        }

        // 克隆查询对象，计算总记录条数
        $countQuery = clone $query;
        $total = $countQuery->count();

        // 计算偏移量
        $offset = ($currentPage - 1) * $size;

        // 查询当前页的数据
        $students = $query->limit($offset, $size)->select();

        // 班级详细信息
        $studentDet = [];
        foreach ($students as $student) {
            // 学生对应的班级id
            $clazzId = $student->clazz_id;
            $clazz = Clazz::get($clazzId);
            $schoolId = $clazz->school_id;
            $school = School::get($schoolId);
            $studentDet[] = [
                'id' => $student->id,
                'name' => $student->name,
                'student_no' => $student->student_no,
                'status' => $student->status,
                'school' => [
                    'id' => $school->id,
                    'school' => $school->school,
                ],
                'clazz' => [
                    'id' => $student->clazz->id,
                    'clazz' => $student->clazz->clazz
                ]
            ];
        }
        $pageData = [
            'content' => $studentDet,
            'number' => $currentPage,
            'size' => $size,
            'numberOfElements' => $total,
            'totalPages' => ceil($total / $size),
        ];

        return json($pageData);

    }

    // 更新学生信息
    public function update() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        // 当前被修改的学生信息
        $student = Student::with('user')->find($id);
        $data = Request::instance()->getContent();
        $studentData = json_decode($data, true);

        // 获取前台传过来的 student_no
        // 如果修改了学生的student_no（学号），则判断是否重复，学号不允许重复
        $studentNo = $studentData['student_no'];

        if($student->student_no !== $studentNo){
            $students = Student::where('student_no', $studentNo)->find();
            if ($students){
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

        // 开启事务
        Db::startTrans();
        try {
            // 更新 student 表
            Db::name('student')
                ->where('id', $id)
                ->update([
                    'name' => $studentData['name'],
                    'student_no' => $studentData['student_no'],
                    'clazz_id' => $studentData['clazz_id'],
                ]);

            // 更新 user 表
            Db::name('user')
                ->where('id', $student->user_id)
                ->update([
                    'username' => $studentData['username'],
                ]);

            // 提交事务
            Db::commit();
            return json(['success' => true, 'message' => '学生信息更新成功']);
        } catch (\Exception $e) {
            Db::rollback();
            return json(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}

