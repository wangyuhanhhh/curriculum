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

    public function index() {
        $totalTeacher = Teacher::select();
        return json($totalTeacher);
    }
}
