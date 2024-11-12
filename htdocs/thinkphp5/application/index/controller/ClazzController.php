<?php
namespace app\index\controller;
use app\common\model\Teacher;
use think\Db;
use think\Request;
use app\common\model\Clazz;
use app\common\model\School;
use app\common\validate\ClazzValidate;

class ClazzController extends IndexController {
    public static function getClazz() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => false, 'message' => 'id不存在']);
        }
        $clazz = Clazz::get($id);
        return $clazz;
    }
     /**
     * 新增
     */
    public function add() {
        // 获取JSON数据
        $content = Request::instance()->getContent();
        // 解析数据
        $data = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $success = false;
            $message = '无效的json数据';
            return json(['success' => $success, 'message' => $message]);
        }
        $validate = new ClazzValidate();
        if ($validate->scene('add')->check($data)) {
            $clazz = new Clazz();
            $clazz->clazz = $data['clazz'];
            $clazz->school_id = $data['school_id'];
            // 检查班级名称是不是以“班”为结尾
            if ($this->endChar($data['clazz'])) {
                // 查重
                if ($this->checkRepeat($clazz, $data['clazz'], $data['school_id'])) {
                    if ($clazz->save()) {
                        $success = true;
                        $message = '新增成功';
                        return json(['success' => $success, 'message' => $message]);
                    } else {
                        $success = false;
                        $message = '新增失败';
                        return json(['success' => $success, 'message' => $message]);
                    }
                } else {
                    // 数据已经存在
                    $success = false;
                    $message = '该班级已存在';
                    return json(['success' => $success, 'message' => $message]);
                }
            } else {
                $success = false;
                $message = "班级名称必须以“班”为结尾";
                return json(['success' => $success, 'message' => $message]);
            }

        } else {
            // 验证失败，返回错误信息
            $success = false;
            $message = $validate->getError();
            return json(['success' => $success, 'message' => $message]);
        }
    }

    /**
     * 在数据库中查重
     * @return boolean
     */
    public function checkRepeat(Clazz $Clazz, $clazz, $school_id) {
        // 使用where方法查询
        $result = $Clazz->where([
            'clazz' => $clazz,
            'school_id' => $school_id
        ]) -> find();

        // 判断查询结果是否为空 结果为空，返回true
        return $result == null;
    }

    /**
     * 检查该班级对应的学校下有没有教师
     */
    public function checkTeacher() {
        // 根据班级获取学校id
        $clazz = ClazzController::getClazz();
        $schoolId = $clazz->school_id;
        // 根据学校id查询该学校下是否有教师
        $teachers = Teacher::where('school_id', $schoolId) -> select();
        if (empty($teachers)) {
            return json(['success' => false, 'message' => '该学校下没有教师，请先添加教师']);
        }
        return json(['success' => true]);
    }

    /**
     * 删除
     * 如果班级下有用户（学生）/班级下有课程安排，不可删除
     */
    public function delete() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        // 查询该id对应的班级信息，同时查询该班级对应的学生信息
        $clazz = Clazz::with(['students', 'courses'])->find($id);
        // 班级不存在
        if (!$clazz) {
            return json(['success' => false, 'message' => '班级不存在']);
        }
        // 该班级下是否有用户（学生）
        if (!empty($clazz->students)) {
            return json(['success' => false, 'message' => '该班级下有用户，无法删除']);
        }
        // 查询班级对应的课程信息
        if (!empty($clazz->courses)) {
            return json(['success' => false, 'message' => '该班级下有课程，无法删除']);
        }
        // 删除班级
        if ($clazz->delete()) {
            return json(['success' => true, 'message' => '删除成功']);
        } else {
            return json(['success' => false, 'message' => '删除失败']);
        }
    }

    /**
     * 检查班级名称是否以“班”为结尾，班级名称必须是“大数据2301班”这种形式
     * @return boolean
     */
    public function endChar($string) {
        $lastChar = mb_substr($string, -1);
        // 是“班”则返回true
        return $lastChar === '班';
    }

    /**
     * 根据id获取对应的班级信息
     */
    public function getClazzById() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        // 班级详细信息，包括对应的学校 clazz
        $clazz = Clazz::with('school')->find($id);
        $clazzJson = json_encode($clazz, JSON_UNESCAPED_UNICODE);
        return $clazzJson;
    }

    /**
     * 根据id获取对应的班级信息
     * 获取当前学校的教师
     */
    public function getMessage() {
        $clazz = $this->getClazz();
        if(!$clazz) {
            return (['success' => false, 'message' => '该班级不存在']);
        }
        // 获取schoolId
        $schoolId = $clazz->school_id;
        $school = School::where('id', $schoolId)->find();
        $teachers = Teacher::where('school_id', $schoolId)->select();
        $teacherDet = [];
        foreach ($teachers as $teacher) {
            $teacherDet[] = [
                'id' => $teacher->id,
                'name' => $teacher->name
            ];
        }
        // 数组保存班级、教师信息
        $data = [
            'id' => $clazz->id,
            'clazz' => $clazz->clazz,
            'school' => [
                'id' => $school->id,
                'school' => $school->school
            ],
            'teacher_id' => $clazz->teacher_id,
            'teachers' => $teacherDet
        ];
        $dataJson = json_encode($data, JSON_UNESCAPED_UNICODE);
        return $dataJson;
    }

    public function index() {
        // 获取所有班级和学校信息
        $clazzes = Clazz::with('school')->select();
        // 班级详细信息，包括对应的学校 clazzDetail
        $clazzDet = [];
        foreach ($clazzes as $clazz) {
            $clazzDet[] = [
                'id' => $clazz->id,
                'clazz' => $clazz->clazz,
                'school' => [
                    'id' => $clazz->school->id,
                    'school' => $clazz->school->school
                ]
            ];
        }
        // 转成json字符串
        $classJson = json_encode($clazzDet, JSON_UNESCAPED_UNICODE);
        return $classJson;
    }

    // 根据schoolId获取班级
    public function getClazzBySchoolId() {
        $request = Request::instance();
        $schoolId = IndexController::getParamId($request);
        if(!$schoolId) {
            return (['success' => false, 'message' => '该学校id没有对应的班级']);
        }
        
        $clazzes = Clazz::where('school_id', $schoolId)->select();

        // 按json格式返回查询到的班级信息
        return json($clazzes);
    }

    /**
     * 搜索，同时包含分页所需要的数据
     */
    public function search() {
        // 获取前端传递的查询参数
        $name = input('clazz', '', 'trim');
        $schoolId = input('school_id', '', 'trim');
        $size = Request::instance()->get('size', 5);
        $currentPage = Request::instance()->get('currentPage', 1);

        // 构建查询条件
        $query = Clazz::with('school'); // 加载关联的 school 数据

        if (!empty($name)) {
            $query->where('clazz', 'like', '%' . $name . '%');
        }
        if (!empty($schoolId)) {
            $query->where('school_id', $schoolId);
        }
        // 克隆查询对象，用于计算总记录条数
        $countQuery = clone $query;
        $total = $countQuery->count();

        // 计算偏移量
        $offset = ($currentPage - 1) * $size;

        // 查询当前页的数据
        $clazzes = $query->limit($offset, $size)->select();

        // 班级详细信息
        $clazzDet = [];
        foreach ($clazzes as $clazz) {
            $teacher = isset($clazz->teacher_id) && $clazz->teacher_id !== null
                ? $clazz->teacher : (object) ['id' => '*', 'name' => '*'];
            $clazzDet[] = [
                'id' => $clazz->id,
                'clazz' => $clazz->clazz,
                'school' => [
                    'id' => $clazz->school->id,
                    'school' => $clazz->school->school
                ],
                'teacher' => [
                    'id' => $teacher->id,
                    'name' => $teacher->name
                ]
            ];
        }

        // 构造分页结果
        $result = [
            'content' => $clazzDet,
            'number' => $currentPage,
            'size' => $size,
            'numberOfElements' => $total,
            'totalPages' => ceil($total / $size),
        ];

        return json($result);
    }

    /**
     * 保存班主任
     */
    public function saveTeacher() {
        // 班级Id
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        // 获取要更新的班级信息
        $content = Request::instance()->getContent();
        // 新教师的id
        $teacher_id = json_decode($content, true);
        $validate = new ClazzValidate();
        if (!$validate->scene('saveTeacher')->check(['teacher_id' => $teacher_id])) {
            return json(['success' => false, 'message' => $validate->getError()]);
        }
        // 获取该班级原教师的id
        $clazz = ClazzController::getClazz();
        $oldTeacherId = $clazz->teacher_id;
        if ($oldTeacherId === $teacher_id) {
            // 如果原教师id与现教师id相同，提示用户教师信息没有更改
            return json(['success' => false, 'message' => '没有任何改动，更新失败']);
        }
        // 查询原教师对应的userId
        $oldTeacher = Teacher::find($oldTeacherId);
        if ($oldTeacher && $oldTeacher->user) {
            $oldUserId = $oldTeacher->user->id;
        }
        // 如果不相同，查询原教师是否还有其他班级
        $ifTeacherWithClazz = Clazz::where('teacher_id', $oldTeacherId)->select();
        // 如果没有，将教师对应的user表中的role改称2,并且将teacher表中的status改成0
        // 原班主任至少关联了一个班级（原班主任关联的原班级)
        // 如果等于1,说明原教师只是原班级这一个班级的班主任
        $count = count($ifTeacherWithClazz);
        if ($count === 1) {
            Db::startTrans();
            try {
                // 更新teacher表
                Db::name('teacher')
                    ->where('id', $oldTeacherId)
                    ->update([
                        'status' => 0
                    ]);
                Db::name('user')
                    ->where('id', $oldUserId)
                    ->update([
                        'role' => 2
                    ]);
                Db::commit();
            } catch (\Exception $e) {
                Db::rollback();
                return json(['success' => false, 'message' => $e->getMessage()]);
            }
        }
        // 查询新教师对应的userId
        $teacher = Teacher::find($teacher_id);
        if ($teacher && $teacher->user) {
            // 该教师对应user表中的id
            $userId = $teacher->user->id;
        }
        // 开启事务，更新clazz表,teacher表,user表
        Db::startTrans();
        try {
            // 更新clazz表
            Db::name('clazz')
                ->where('id', $id)
                ->update([
                    'teacher_id' => $teacher_id
                ]);

            // 更新teacher表
            Db::name('teacher')
                ->where('id', $teacher_id)
                ->update([
                    'status' => 1
                ]);

            // 更新user表
            Db::name('user')
                ->where('id', $userId)
                ->update([
                    'role' => 4
                ]);
            Db::commit();
            return json(['success' => true, 'message' => '班主任设置成功']);
        } catch (\Exception $e) {
            Db::rollback();
            return json(['success' => false, 'message' => '设置失败请重试']);
        }
    }
    /**
     * 更新班级信息
     */
    public function update() {
        // 获取数据
        $content = Request::instance()->getContent();
        $data = json_decode($content, true);
        // 验证（validate， endChar checkRepeat)
        $validate = new ClazzValidate();
        if ($validate->scene('edit')->check($data)){
            // 获取原班级信息
            $clazz = ClazzController::getClazz();
            $clazz->clazz = $data['clazz'];
            $clazz->school_id = $data['school_id'];
            // 检查班级名称是否合法
            if ($this->endChar($data['clazz'])) {
                // 查重
                if ($this->checkRepeat($clazz, $data['clazz'], $data['school_id'])) {
                    if ($clazz->save()) {
                        return json(['success' => true, 'message' => '编辑成功']);
                    } else {
                        return json(['success' => false, 'message' => '编辑失败']);
                    }
                } else {
                    return json(['success' => false, 'message' => '该班级已存在']);
                }
            } else {
                return json(['success' => false, 'message' => '班级名称必须以“班”为结尾']);
            }
        } else {
            return json(['success' => false, 'message' => $validate->getError()]);
        }
        // 保存
    }
}
