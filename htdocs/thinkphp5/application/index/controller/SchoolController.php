<?php
namespace app\index\controller;
use app\common\model\School;
use app\common\model\Teacher;
use app\common\model\Clazz;
use think\Request;
use think\Db;
use app\common\validate\SchoolValidate;

class SchoolController extends IndexController {
    public static function getSchool() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => false, 'message' => 'id不存在']);
        }
        $school = School::get($id);
        return $school;
    }

    /**
     * 接受数据并执行新增操作
     */
    public function add() {
        // 获取并解析JSON数据
        $content = Request::instance()->getContent();
        $parsedData = json_decode($content, true);
        $School = new School();
        if (json_last_error() !== JSON_ERROR_NONE) {
            $success = false;
            $message = '无效的json数据';
            return json(['success' => $success, 'message' => $message]);
        }
        // 验证数据
        $validate = new SchoolValidate();
        if ($validate -> check($parsedData)) {
            // 检查$parsedData是否被正确解析并且包含'school'键
            if (is_array($parsedData) && isset($parsedData['school'])) {
                // 接收到的学校名
                $schoolName = $parsedData['school'];
                // 检查数据是否已经存在
                $isExist = School::where('school', $schoolName)->find();
                if ($isExist) {
                    $success = false;
                    $message = '学校已存在';
                    return json(['success' => $success, 'message' => $message]);
                } else {
                    $School->school = $schoolName;
                    if ($School->save()) {
                        $success = true;
                        $message = '新增成功';
                        return json(['success' => $success, 'message' => $message]);
                    } else {
                        $success = false;
                        $message = '新增失败';
                        return json(['success' => $success, 'message' => $message]);
                    }
                }
            }
        } else {
            $success = false;
            $message = $validate->getError();
            return json(['success' => $success, 'message' => $message]);
        }
    }

    /**
     * 检查该学校下是否有班级
     * 学校下的班级至少要有一个班主任
     */
    public function checkSchool() {
        // 获取学校下的id
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        // 查询该学校下是否有班级
        $clazzes = Clazz::where('school_id', $id)->select();
        if (empty($clazzes)) {
            return json(['success' => false, 'message' => '该学校下没有班级，请先添加班级']);
        }
        // 检查班级下是否有班主任
        $hasTeacher = false;
        $message = '只有班主任可以设置成管理员，请至少为一个班级设置班主任';
        foreach ($clazzes as $clazz) {
            if ($clazz->teacher_id !== null) {
                // 有班主任，设置为true
                $hasTeacher = true;
                break;
            }
        }
        return json(['success' => $hasTeacher, 'message' => $message]);
    }

    public function delete() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        // 查询id对应的学校信息，同时查询该学校对应的班级信息
        $school = School::with('clazzes')->find($id);
        // id没有学校信息
        if (!$school) {
            $success = false;
            $message = '学校不存在';
            return json(['success' => $success, 'message' => $message]);
        }
        // 学校下存在班级
        if (!empty($school->clazzes)) {
            return json(['success' => false, 'message' => '该学校有班级，无法删除']);
        }
        // 删除
        if ($school->delete()) {
            $success = true;
            $message = '删除成功';
            return json(['success' => $success, 'message' => $message]);
        } else {
            $success = false;
            $message = '删除失败';
            return json(['success' => $success, 'message' => $message]);
        }
    }

    public function edit() {
        $school = SchoolController::getSchool();
        $schoolJson = json_encode($school, JSON_UNESCAPED_UNICODE);  
        return $schoolJson;
    }

    /**
     * 根据id获取学校信息以及该学校下的班主任信息
     */
    public function getMessage() {
        // 获取学校信息
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        $school = SchoolController::getSchool();
        $clazzes = Clazz::where('school_id', $id)->select();
        foreach ($clazzes as $clazz) {
            $teacherIds[] = $clazz['teacher_id'];
        }
        // 去重
        $teacherIds = array_unique($teacherIds);
        // 查询所有teacherId对应的教师信息
        $teachers = Teacher::where('id', 'in', $teacherIds)->select();
        // 如果该学校本来就有管理员，获取管理员id
        $admins = Teacher::with('user')->where('teacher.id', 'in', $teacherIds)->select();
        $adminIds = [];
        if (!empty($admins)) {
            // user中role为1的是管理员
            $role = 1;
            foreach ($admins as $admin) {
                if ($admin->user && $admin->user->role === $role) {
                    $adminIds[] = $admin->id;
                }
            }
        }
        $data = [
            'id' => $school->id,
            'school' => $school->school,
            'teachers' => $teachers,
            'teacher_id' => $adminIds
        ];
        $dataJson = json_encode($data, JSON_UNESCAPED_UNICODE);
        return $dataJson;
    }

    public function index() {
        $schoolModel = new School();
        // 获取所有学校集合
        $schools = $schoolModel -> select();
        // 转换成JSON字符串 JSON_UNESCAPED_UNICODE避免中文字符被转义
        $schoolJson = json_encode($schools, JSON_UNESCAPED_UNICODE);
        return $schoolJson;
    }

    /**
     * 保存管理员
     */
    public function saveAdmin() {
        // 获取学校id
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        // 获取管理员id teacherIds类型: 数组
        $content = Request::instance()->getContent();
        $teacherIds = json_decode($content, true);
        // 查询该学校下所有班级
        $clazzes = Clazz::where('school_id', $id)->select();
        // 获取所有的班级对应的教师id
        foreach ($clazzes as $clazz) {
            $allTeacherIds[] = $clazz->teacher_id;
        }
        // 查询班级下所有教师，同时查询出该教师对应的user表中的信息
        if ($allTeacherIds) {
            $teachers = Teacher::with('user')
                ->where('teacher.id', 'in', $allTeacherIds)
                ->select();
        }
        // user中role为1的是管理员
        $role = 1;
        // 如果该学校本来就有管理员，查询出管理员的id
        foreach ($teachers as $teacher) {
            if ($teacher->user && $teacher->user->role === $role) {
                $oldAdminIds[] = $teacher->id;
            }
        }
        // 判断管理员id是否发生变化，如果没有发生变化，提示用户管理员信息没有发生改变，编辑失败
        if (!empty($oldAdminIds)) {
            if ($oldAdminIds == $teacherIds) {
                return json(['success' => false, 'message' => '没有任何改动，更新失败']);
            }
            // 查找出只存在$oldAdminIds中的数据 保存的是教师id
            $removedAdmins = array_diff($oldAdminIds, $teacherIds);
            if (!empty($removedAdmins)) {
                // 获取原管理员跟现管理员不同的id，并将该id对应的user中的role改成4
                $oldAdmins = Teacher::with('user')
                    ->where('teacher.id', 'in', $removedAdmins)
                    ->select();
                foreach ($oldAdmins as $admin) {
                    if ($admin->user) {
                        $admin->user->role = 4;
                        $admin->user->save();
                    }
                }
            }
        }
        // 更新该教师的role
        // 获取要更新的教师信息
        $newTeachers = Teacher::with('user')
                       ->where('teacher.id', 'in', $teacherIds)
                       ->select();
        // 记录数据库中更新的数据条数
        $affectRows = 0;
        foreach ($newTeachers as $teacher) {
            if ($teacher->user) {
                $teacher->user->role = 1;
                $teacher->user->save();
                $affectRows++;
            }
        }
        if ($affectRows > 0) {
            return json(['success' => true, 'message' => '管理员设置成功']);
        } else {
            return json(['success' => false, 'message' => '设置失败请重试']);
        }
    }

    /**
     * 分页搜索
     */
    public function search() {
        // 获取前端的查询参数
        $name = input('name', '', 'trim');
        $size = Request::instance()->get('size', 5);
        $currentPage = Request::instance()->get('currentPage', 1);

        // 构建查询条件
        $query = Db::name('school');

        if (!empty($name)) {
            $query->where('school', 'like', '%' . $name . '%');
        }

        // 克隆查询对象，计算查询总记录数
        $countQuery = clone $query;
        $total = $countQuery->count();

        // 计算偏移量
        $offset = ($currentPage - 1) * $size;

        // 查询当前页的数据
        $data = $query->limit($offset, $size)->select();
        foreach ($data as $school) {
            $schoolIds[] = $school['id'];
        }
        $clazzes = Clazz::where('school_id', 'in', $schoolIds)->select();
        if (!empty($data)) {
            foreach ($data as $school) {
                $admins = [];
                // 获取学校下的班级
                $schoolClazzes = array_filter($clazzes, function ($clazz) use ($school) {
                    return $clazz->school_id == $school['id'];
                });
                // 检查班级是否有班主任并且是管理员
                $isAdmin = false;
                // user中role为1的是管理员
                $role = 1;
                foreach ($schoolClazzes as $clazz) {
                    if ($clazz->teacher_id !== null) {
                        $teacher = Teacher::with('user')->find($clazz->teacher_id);
                        if ($teacher && $teacher->user && $teacher->user->role === $role) {
                            $admins[] = [
                                'id' => $teacher->id,
                                'name' => $teacher->name,
                            ];
                            $isAdmin = true;
                        }
                    }
                }
                // 如果没有找到管理员
                if (!$isAdmin) {
                    $admins[] = [
                        'id' => '*',
                        'name' => '*'
                    ];
                }
                $detail[] = [
                    'id' => $school['id'],
                    'school' => $school['school'],
                    'teacher' => $admins
                ];
            }
        }
        // 构造分页结果
        $result = [
            'content' => $detail,
            'number' => $currentPage,
            'size' => $size,
            'numberOfElements' => $total,
            'totalPages' => ceil($total / $size),
        ];

        return json($result);
    }
    
    // 更新数据
    public function update() {
        // 获取数据
        $content = Request::instance()->getContent();
        $parsedData = json_decode($content, true);
        $validate = new SchoolValidate();
        if ($validate -> check($parsedData)) {
            // 前台传过来的要进行更新的学校名
            $updateSchool = $parsedData['school'];
            // 检查数据是否已经存在，存在返回true，不存在返回false
            $isExist = School::where('school', $updateSchool) -> find();
            // 若已存在，提示前台数据已经存在
            if ($isExist) {
                return json(['success' => false, 'message' => '学校已存在']);
            } else {
                // 数据库中不存在，更新数据
                $school = SchoolController::getSchool();
                $school->school = $updateSchool;
                $result = $school->save();
                if ($result) {
                    $success = true;
                    $message = '编辑成功';
                    return json(['success' => $success, 'message' => $message]);
                } else {
                    $success = false;
                    $message = '编辑失败请重试';
                    return json(['success' => $success, 'message' => $message]);
                }
            }
        } else {
            return json(['success' => false, 'message' => $validate->getError()]);
        }
    }
}
