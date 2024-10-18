<?php
namespace app\index\controller;
use app\common\model\Teacher;
use app\common\model\User;
use app\common\validate\TeacherValidate;
use think\Db;
use think\Request;

class TeacherController extends IndexController {

    public function add() {
        // 接收前台的数据
        $request = Request::instance()->getContent();
        $data = json_decode($request, true);
        // 查重
        $teacherNo = $data['teacher_no'];
        $teachers = Teacher::where('teacher_no', $teacherNo)->find();

        if ($teachers) {
            return json(['success' => false, 'message' => '该工号教师已存在，新增失败']);
        }


        // 开启事务
        Db::startTrans();
        try {
            // 第一步，先新增 user 数据
            $user = new User();
            $user->username = $data['username'];
            $user->password = $teacherNo;
            $user->role = 2;

            // 数据校验
            $validate = new TeacherValidate;
            if ($validate->scene('addUser')->check((array)$user)) {
                // 验证失败，返回错误信息
                return json(['success' => false, 'message' => $validate->getError()]);
            }

            if (!$user->save()) {
                throw new \Exception('用户创建失败');
            }

            // 第二步，新增 teacher 数据，并将 user 的 id 作为 user_id 储存
            $teacher = new Teacher();
            $teacher->name = $data['name'];
            $teacher->teacher_no = $teacherNo;
            $teacher->user_id = $user->id;

            // 数据验证
            if ($validate->scene('addTeacher')->check((array)$teacher)) {
                // 验证失败，返回错误信息
                return json(['success' => false, 'message' => $validate->getError()]);
            }

            if (!$teacher->save()) {
                throw new \Exception('教师创建失败');
            }

            // 提交事务
            Db::commit();
            return json(['success' => true, 'message' => '教师用户创建成功']);
        } catch (\Exception $e) {
            // 回滚事务
            return json(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // 删除
    public function delete() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        $teacher = Teacher::get($id);
        if (!$teacher) {
            return json(['success' => false, 'message' => '该教师不存在，删除失败']);
        }

        // 开启事务
        Db::startTrans();
        try {
            // 第一步，先删除 teacher 中的数据
            Db::name('teacher')
                ->where('id', $id)
                ->delete();

            // 第二步，删除 user 中的数据
            Db::name('user')
                ->where('id', $teacher->user_id)
                ->delete();

            Db::commit();
            return json(['success' => true, 'message' => '教师用户删除成功']);
        } catch (\Exception $e) {
            Db::rollback();
            return json(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // 根据id获取数据
    public function getById() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if(!$id) {
            return (['success' => false, 'message' => '该教师不存在']);
        }
        // 使用 with 预加载于 teacher 相关的 user 数据；这里的user是定义在Teacher模型中的联系方法
        $teacherData = Teacher::with('user')->find($id);
        // 重新整合一个新数据组，只给前台发送name、username、teacher_no
        $teacher['name'] = $teacherData->name;
        $teacher['username'] = $teacherData->user->username;
        $teacher['teacher_no'] = $teacherData->teacher_no;

        return json($teacher);
    }

    public function index() {
        $totalTeacher = Teacher::select();
        return json($totalTeacher);
    }

    // 搜索
    public function search() {
        // 获取前端传递的查询参数
        $name = input('name', '', 'trim');
        $teacherNo = input('teacher_no', '', 'trim');

        //构建查询条件
        $query = Db::name('teacher');

        if (!empty($name)) {
            $query->where('name', 'like', '%' . $name . '%');
        }

        if (!empty($teacherNo)) {
            $query->where('teacher_no', 'like', '%' . $teacherNo . '%');
        }

        // 执行查询并返回结果
        $result = $query->select();
        return json($result);

    }

    // 更新教师信息
    public function update() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        $teacher = Teacher::with('user')->find($id);    // 获取当前被修改的教师信息
        $data = Request::instance()->getContent();
        $teacherData = json_decode($data, true);

        // 获取前台传过来的 teacher_no
        // 如果修改了教师的 teacher_no（工号），则判断是否重复，工号不允许重复
        $teacherNo = $teacherData['teacher_no'];
        if ($teacher->teacher_no !== $teacherNo) {
            $teachers = Teacher::where('teacher_no', $teacherNo)->find();
            if ($teachers) {
                return json(['success' => false, 'message' => '该工号已被使用，编辑失败']);
            }
        }

        // 比较各字段是否有改动
        $noChange = true;
        if ($teacher->name !== $teacherData['name']) {
            $noChange = false;
        }
        if ($teacher->teacher_no !== $teacherData['teacher_no']) {
            $noChange = false;
        }
        if ($teacher->user->username !== $teacherData['username']) {
            $noChange = false;
        }

        if ($noChange) {
            return json(['success' => false, 'message' => '没有任何改动，更新失败']);
        }

        // 开启事务
        Db::startTrans();
        try {
            // 更新 teacher 表
            Db::name('teacher')
                ->where('id', $id)
                ->update([
                    'name' => $teacherData['name'],
                    'teacher_no' => $teacherData['teacher_no'],
                ]);

            // 更新 user 表
            Db::name('user')
                ->where('id', $teacher->user_id)
                ->update([
                    'username' => $teacherData['username'],
                ]);

            // 提交事务
            Db::commit();
            return json(['success' => true, 'message' => '教师信息更新成功']);
        } catch (\Exception $e) {
            Db::rollback();
            return json(['success' => false, 'message' => '更新失败']);
        }
    }
}
