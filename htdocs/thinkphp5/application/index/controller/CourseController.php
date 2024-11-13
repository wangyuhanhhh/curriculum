<?php
namespace app\index\controller;
use app\common\model\Teacher;
use DateTime;
use think\Request;
use think\Db;
use app\common\model\Course;
use app\common\model\CourseInfo;
use app\common\model\Student;
use app\common\model\Clazz;
use app\common\model\Term;

class CourseController extends IndexController {
    private $doubleWeek = 1;    // 双周
    private $singleWeek = 2;    // 单周

    /**
     * 新增
     * 课程名重复但是课程类型不同 新增失败
     * 课程时间相同，新增失败
     */
    public function add() {
        // 获取JSON数据
        $content = Request::instance()->getContent();
        // 解析数据
        $data = json_decode($content, true);

        $id = $this->getUserIdByLoginUser();
        $student = Student::where('user_id', $id)->find();
        $studentId = $student->id;
        // 学期id
        $term = $this->getTermByLoginUser();
        // 班级id
        $clazzId = $this->getClazzIdByLoginUser();
        // 当前登录用户的学期id
        $termId = $term->id;
        // 检查时间是否合法
        if ($this->isTimeLegal($data)) {
            Db::startTrans();
            try {
                // 查询是否存在相同的课程
                $course = Course::where([
                    'name' => $data['name'],
                    'type' => $data['type'],
                    'term_id' => $termId,
                    'clazz_id' => $clazzId,
                ])->find();
                // 不存在相同的课程，创建课程
                if (!$course) {
                    // 先新增course中的数据
                    $course = new Course();
                    $course->name = $data['name'];
                    $course->type = $data['type'];
                    $course->term_id = $termId;
                    $course->clazz_id = $clazzId;

                    if ($data['type'] === 1) {
                        $course->student_id = $studentId;
                    }

                    if (!$course->save()) {
                        throw new \Exception('课程创建失败');
                    }
                }

                // 新增课程安排
                $courseInfo = new CourseInfo();
                $courseInfo->start_weeks = $data['start_weeks'];
                $courseInfo->end_weeks = $data['end_weeks'];
                $courseInfo->week = $data['week'];
                $courseInfo->begin = $data['begin'];
                $courseInfo->length = $data['end'] - $data['begin'] + 1;
                $courseInfo->status = $data['status'];
                $courseInfo->course_id = $course->id;

                if (!$courseInfo->save()) {
                    throw new \Exception('课程安排创建失败');
                }

                // 提交事务
                Db::commit();
                return json(['success' => true, 'message' => '课程新增成功']);
            } catch (\Exception $e) {
                // 回滚事务
                Db::rollback();
                return json(['success' => false, 'message' => $e->getMessage()]);
            }
        } else {
            return json(['success' => false, 'message' => '该时间段已有其它课程，请修改信息']);
        }
    }

    /**
     * 检查当前登录用户的学校是否有的学期
     * 如果有学期，检查是不是激活状态
     */
    public function checkTerm() {
        $clazzId = $this->getClazzIdByLoginUser();
        // 根据clazzId获取学校信息
        $clazz = Clazz::where('id', $clazzId)->find();
        // 获取学校id
        $schoolId = $clazz->school_id;
        $terms = Term::where('school_id', $schoolId)->select();
        if (!empty($terms)) {
            $term = Term::where('school_id', $schoolId)
                     ->where('status', 1)
                     ->find();
            if (empty($term)) {
                return json(['success' => false, 'message' => '当前用户所在学校没有激活的学期，请先激活学期', 'data' => false]);
            }
        } else {
            return json(['success' => false, 'message' => '当前用户所在学校没有学期信息，请先添加学期', 'data' => false]);
        }
        return json(['success' => true, 'data' => true]);
    }

    /**
     * 获取当前学生用户所在的学期的 termId
     */
    public function getTermIdForStudent() {
        $clazzId = $this->getClazzIdByLoginUser();
        // 根据clazzId获取学校信息
        $clazz = Clazz::where('id', $clazzId)->find();
        // 获取学校id
        $schoolId = $clazz->school_id;
        $term = Term::where('school_id', $schoolId)
            ->where('status', 1)
            ->find();
        if (!empty($term)) {
            $termId = $term->id;
        } else {
            $termId = 0;
        }
        return json([$termId]);
    }

    public function checkTermOfTeacher() {
        $schoolId = $this->getSchoolIdByLoginUser();
        $terms = Term::where('school_id', $schoolId)->select();
        if (!empty($terms)) {
            $term = Term::where('school_id', $schoolId)->where('status', 1)->find();
            if (empty($term)) {
                return json(['success' => false, 'message' => '当前用户所在学校没有激活的学期，请先激活学期', 'data' => false]);
            }
        } else {
            return json(['success' => false, 'message' => '当前用户所在学校没有学期信息，请先添加学期', 'data' => false]);
        }

        return json(['success' => true, 'data' => true]);
    }

    /**
     * 删除
     * 如果该课程对应多条课程安排，只删除对应的课程安排
     * 如果该课程只有一条课程安排，把对应的课程也删除了
     */
    public function delete() {
        $request = Request::instance();
        $courseInfoId = IndexController::getParamId($request);
        $courseInfo = CourseInfo::where('id', $courseInfoId)->find();
        // 课程安排不存在
        if (!$courseInfo) {
            return json(['success' => false, 'message' => '课程安排不存在']);
        }
        $courseId = $courseInfo->course_id;
        // 该课程对应的课程安排
        $courseInfos = CourseInfo::where('course_id', $courseId)->select();
        $count = count($courseInfos);
        // 课程对应多条课程安排，只删除这一条课程安排的数据
        if ($count > 1) {
            if ($courseInfo->delete()) {
                return json(['success' => true, 'message' => '课程删除成功']);
            } else {
                return json(['success' => false, 'message' => '课程删除失败']);
            }
        } else {
            // 删除课程和课程安排的数据
            Db::startTrans();
            try {
                // 第一步，先删除 teacher 中的数据
                Db::name('course')
                    ->where('id', $courseId)
                    ->delete();

                // 第二步，删除 user 中的数据
                Db::name('courseInfo')
                    ->where('id', $courseInfoId)
                    ->delete();

                Db::commit();
                return json(['success' => true, 'message' => '课程删除成功']);
            } catch (\Exception $e) {
                Db::rollback();
                return json(['success' => false, 'message' => $e->getMessage()]);
            }
        }
    }

    /**
     * 接收参数 schoolId
     * 根据学校 id 获取对应的激活学期 id
     * @return $termId
     */
    public function getActiveTermId($schoolId) {
        $terms = Term::where('school_id', $schoolId)->select();

        if (!empty($terms)) {
            $termId = Term::where('school_id', $schoolId)->where('status', 1)->value('id');
            if (empty($termId)) {
                // 如果该学校下没有激活的学期，返回 0
                return 0;
            }
        } else {
            // 学校下没有学期数据
            return 0;
        }

        return $termId;
    }

    /**
     * 根据 schoolId、week 获取该学校所有学生的有课时间表
     */
    public function getAllStudentsCourse() {
        $schoolId = input('get.schoolId', '');
        $week = input('get.week', '');

        // 根据 schoolId 获取对应学校所有的班级的id（clazzId）
        $clazzIds = $this->getClazzIdBySchoolId($schoolId);
        // 根据 schoolId 获取对应激活的学期 id
        $termId = $this->getActiveTermId($schoolId);
        if ($termId == 0) {
            return json([]);
        }
        $courseList = [];
        $rqCourseInfoList = [];
        $etCourseInfoList = []; // 用于保存选修课

        if ($clazzIds) {
            foreach ($clazzIds as $clazzId) {
                // 查询 clazz_id 对应的课程信息
                $courses = Course::where('clazz_id', 'in', $clazzId)
                    ->where('term_id', $termId)
                    ->column('id, clazz_id, name as course_name, type, student_id');

                $courseList = array_merge($courseList, $courses);
            }
        }

        // 判断当前所查询的 week 是奇数还是偶数
        $statusFilter = ($week % 2 == 1) ? $this->doubleWeek : $this->singleWeek;

        if ($courseList) {
            foreach ($courseList as $course) {
                if (is_null($course['student_id'])) {
                    $rqCourseInfo = CourseInfo::where('course_id', $course['id'])
                        ->where('start_weeks', '<=', $week)
                        ->where('end_weeks', '>=', $week)
                        ->where('status', 'neq', $statusFilter)
                        ->select();

                    // 如果 student_id 为 null，根据 clazz_id 获取班级的所有学生
                    $students = Student::where('clazz_id', $course['clazz_id'])->column('name');

                    // 为每个必修课安排添加学生姓名
                    foreach ($rqCourseInfo as $info) {
                        $info['students'] = $students;
                    }

                    $rqCourseInfoList = array_merge($rqCourseInfoList, $rqCourseInfo);
                } else {
                    $etCourseInfo = CourseInfo::where('course_id', $course['id'])
                        ->where('start_weeks', '<=', $week)
                        ->where('end_weeks', '>=', $week)
                        ->where('status', 'neq', $statusFilter)
                        ->select();

                    // student_id 不会 null， 根据 student_id 获取该学生姓名
                    $student = Student::where('id', $course['student_id'])->find();

                    // 为每个必修课安排添加学生姓名
                    foreach ($etCourseInfo as $info) {
                        $info['students'] = [$student->name]    ;
                    }

                    $etCourseInfoList = array_merge($etCourseInfoList, $etCourseInfo);
                }
            }

        }  else {
            return json([]); // 不存在课程
        }

        $courseInfoList = array_merge($rqCourseInfoList, $etCourseInfoList); // 合并选修和必修的课程信息列表

        // 去重处理：合并相同的 week、begin、length 的课程安排
        $uniqueCourseInfoList = [];
        foreach ($courseInfoList as $info) {
            // 生成唯一键，确保同一课程安排合并
            $key = "{$info['week']}_{$info['begin']}_{$info['length']}";

            if (!isset($uniqueCourseInfoList[$key])) {
                // 初始化存储合并的课程安排
                $uniqueCourseInfoList[$key] = $info;
            } else {
                // 将学生姓名合并到同一课程安排中
                $uniqueCourseInfoList[$key]['students'] = array_merge($uniqueCourseInfoList[$key]['students'], $info['students']);
            }
        }

        // 去除重复的学生姓名
        foreach ($uniqueCourseInfoList as &$courseInfo) {
            if (isset($courseInfo['students']) && count($courseInfo['students']) > 1) {
                $courseInfo['students'] = array_unique($courseInfo['students']);
            }
        }

        return json(array_values($uniqueCourseInfoList));
    }

    /**
     * 根据 schoolId 获取所有 clazzId
     * @return $clazzId
     */
    public function getClazzIdBySchoolId($schoolId) {
        $clazzId = Clazz::where('school_id', $schoolId)->column('id');
        return $clazzId;
    }

    /**
     * 根据 clazzId 获取该班级所有学生
     */
    public function getAllStudentByClazzId($clazzId) {
        $students = Student::where('clazz_id', $clazzId)
            ->where('status', 1) // 激活状态的学生
            ->value('name')
            ->select();

        return $students;
    }

    /**
     * 获取当前学生的学期总课表
     */
    public function getAllCourseByStudent() {
        // 获取当前学生的班级
        $clazzId = $this->getClazzIdByLoginUser();
        $userId = $this->getUserIdByLoginUser();

        // 获取 school_id，并且获取激活的 term_id
        $schoolId = Clazz::where('id', $clazzId)->value('school_id');
        $termId = $this->getActiveTermId($schoolId);
        if ($termId == 0) {
            return json([]);
        }

        // 获取该班级的所有必修课（type 为 2）
        // 获取班级的必修课（Required courses）的课程
        $rqCourses = Course::where('clazz_id', $clazzId)
            ->where('term_id', $termId)
            ->where('type', 2) //值筛选 type 为 2 ，也就是必修课
            ->select();

        // 获取该学生的选修课，根据 student_id、 type = 1 筛选
        $studentId = Student::where('user_id', $userId)->value('id');
        $etCourse = Course::where('student_id', $studentId)
            ->where('term_id', $termId)
            ->where('type', 1)
            ->select();

        // 获取选修和必修课的课程安排
        $courseInfoList = [];
        $myCourseInfoList = [];

        if (!empty($rqCourses)) {
            foreach ($rqCourses as $course) {
                $courseInfo = CourseInfo::where('course_id', $course->id)->select();

                // 为每个课程安排添加课程名称
                foreach ($courseInfo as &$info) {
                    $info['courseName'] = $course->name;
                }

                // 将符合条件的课程安排添加到列表
                $courseInfoList = array_merge($courseInfoList, $courseInfo);
            }
        }

        // 处理 etCourse 为空的情况
        if (!empty($etCourse)) {
            foreach ($etCourse as $course) {
                $myCourseInfo = CourseInfo::where('course_id', $course->id)->select();

                // 为每个课程安排添加课程名称
                foreach ($myCourseInfo as &$info) {
                    $info['courseName'] = $course->name;
                }

                $myCourseInfoList = array_merge($myCourseInfoList, $myCourseInfo);
            }

            // 将选修课安排添加到课程信息列表中(合并必修和选修课程安排)
            if (!empty($myCourseInfoList)) {
                $courseInfoList = array_merge($courseInfoList, $myCourseInfoList);
            }
        }
        // 整合数据，返回前台
        $json = json_encode($courseInfoList, JSON_UNESCAPED_UNICODE);
        return $json;
    }

    /**
     * 根据 clazz_id 获取该班级的学期总课表
     */
    public function getAllCourseByClazz() {
        // 获取前台传的 clazz_id
        $request = Request::instance();
        $clazzId = IndexController::getParamId($request);

        // 判断 clazz_id 为 null 的情况
        if (is_null($clazzId)) {
            return json([]);
        }

        $schoolId = Clazz::where('id', $clazzId)->value('school_id');
        $termId = $this->getActiveTermId($schoolId);

        if ($termId == 0) {
            return json([]);
        }

        // 只查询该班级下的必修课（考虑为空的情况）
        $rqCourses = Course::where('clazz_id', $clazzId)
                            ->where('term_id', $termId)
                            ->where('type', 2)
                            ->select();

        // 获取必修课的课程安排
        $courseInfoList = [];

        if (!empty($rqCourses)) {
            foreach ($rqCourses as $course) {
                $courseInfo = CourseInfo::where('course_id', $course->id)->select();

                // 为每个课程安排添加课程名称
                foreach ($courseInfo as &$info) {
                    $info['courseName'] = $course->name;
                }

                // 将符合条件的课程安排添加到列表
                $courseInfoList = array_merge($courseInfoList, $courseInfo);
            }
        }

        // 整合数据，返回前台
        $json = json_encode($courseInfoList, JSON_UNESCAPED_UNICODE);
        return $json;
    }

    /**
     * 学生
     * 获取当前登录用户的班级id
     */
    public function getClazzIdByLoginUser() {
        $id = $this->getUserIdByLoginUser();
        // 根据id获取当前登录的是哪个学生
        $student = Student::where('user_id', $id)->find();
        // 根据学生的clazzId查找是哪个班级
        $clazzId = $student->clazz_id;
        return $clazzId;
    }

    /**
     * 教师
     * 获取当前登录用户的学校id
     */
    public function getSchoolIdByLoginUser() {
        $id = $this->getUserIdByLoginUser();
        // 根据 id 获取当前登录的是哪个教师
        $schoolId = Teacher::where('user_id', $id)->value('school_id');
        return $schoolId;
    }

    /**
     * 根据id获取课程信息
     */
    public function getCourseById() {
        $id = Request::instance()->get('id');
        $courseInfoId = Request::instance()->get('courseInfoId');
        $course = Course::with(['courseInfos' => function ($query) use ($courseInfoId) {
                             $query->where('id', $courseInfoId);
                         }])
                         ->where('id', $id)->find();

        $term = $this->getTermByLoginUser();
        $weekRange = $this->getWeek();

        $courseInfos = $course->courseInfos;
        // 因为$course->courseInfos是一个数组，所以需要遍历之后访问
        foreach ($courseInfos as $courseInfo) {
            $courseDet = [
                'term' => $term,
                'id' => $course->id,
                'name' => $course->name,
                'type' => $course->type,
                'courseInfoId' => $courseInfo->id,
                'status' => $courseInfo->status,
                'weeks' => $weekRange,
                'start_weeks' => $courseInfo->start_weeks,
                'end_weeks' => $courseInfo->end_weeks,
                'week' => $courseInfo->week,
                'begin' => $courseInfo->begin,
                'end' => $courseInfo->begin + $courseInfo->length - 1
            ];
        }
        return json($courseDet);
    }

    /**
     * 获取当前登录用户（确定是学生）确定周的课表
     */
    public function getCourseTableByWeek() {
        // 获取前台传的 week 值
        $week = input('get.week', '');

        // 获取当前学生的 clazz_id
        $userId = $this->getUserIdByLoginUser();
        $clazzId = Student::where('user_id', $userId)->value('clazz_id');

        // 获取 school_id 以及已被激活的 term_id
        $schoolId = Clazz::where('id', $clazzId)->value('school_id');
        $termId = $this->getActiveTermId($schoolId);

        if ($termId == 0) {
            return json([]);
        }

        // 获取班级的必修课（Required courses）的课程
        $rqCourses = Course::where('clazz_id', $clazzId)
                            ->where('term_id', $termId)
                            ->where('type', 2) //值筛选 type 为 2 ，也就是必修课
                            ->select();

        // 获取当前学生的选修课（Elective courses）的课程
        $studentId = Student::where('user_id', $userId)->value('id');
        $etCourse = Course::where('student_id', $studentId)
                            ->where('term_id', $termId)
                            ->where('type', 1)
                            ->select();

        // 通过 course_id 获取对应课程安排，过滤条件为周数
        $courseInfoList = [];
        $myCourseInfoList = [];

        // 判断当前所查询的 week 是基数还是偶数
        // 基数，则过滤 status = 1（双周）；反之，过滤 status = 2（单周）
        $statusFilter = ($week % 2 == 1) ? $this->doubleWeek : $this->singleWeek;

        if (!empty($rqCourses)) {
            foreach ($rqCourses as $course) {
                $courseInfo = CourseInfo::where('course_id', $course->id)
                    ->where('start_weeks', '<=', $week)
                    ->where('end_weeks', '>=', $week)
                    ->where('status', 'neq', $statusFilter)
                    ->select();

                // 为每个课程安排添加课程名称
                foreach ($courseInfo as &$info) {
                    $info['courseName'] = $course->name;
                }

                // 将符合条件的课程安排添加到列表
                $courseInfoList = array_merge($courseInfoList, $courseInfo);
            }
        }

        // 处理 etCourse 为空的情况
        if (!empty($etCourse)) {
            foreach ($etCourse as $course) {
                $myCourseInfo = CourseInfo::where('course_id', $course->id)
                    ->where('start_weeks', '<=', $week)
                    ->where('end_weeks', '>=', $week)
                    ->where('status', 'neq', $statusFilter)
                    ->select();

                // 为每个课程安排添加课程名称
                foreach ($myCourseInfo as &$info) {
                    $info['courseName'] = $course->name;
                }

                $myCourseInfoList = array_merge($myCourseInfoList, $myCourseInfo);
            }

            // 将选修课安排添加到课程信息列表中(合并必修和选修课程安排)
            if (!empty($myCourseInfoList)) {
                $courseInfoList = array_merge($courseInfoList, $myCourseInfoList);
            }
        }

        // 整合数据，传到前台
        $json = json_encode($courseInfoList, JSON_UNESCAPED_UNICODE);
        return $json;
    }

    /**
     * 获取当前用户的学期，并根据学期计算周数
     */
    public function getMessage() {
        $term = $this->getTermByLoginUser();
        $weekRange = $this->getWeek();
        $message = [
            'term' => $term,
            'weeks' => $weekRange
        ];
        $json = json_encode($message, JSON_UNESCAPED_UNICODE);
        return $json;
    }

    /**
     * 根据当前登录用户获取学期
     */
    public function getTermByLoginUser() {
        $clazzId = $this->getClazzIdByLoginUser();
        // 根据clazzId获取学校信息
        $clazz = Clazz::where('id', $clazzId)->find();
        // 获取学校id
        $schoolId = $clazz->school_id;
        // 查询对应学校激活状态的学期
        $term = Term::where('school_id', $schoolId)
            ->where('status', 1)
            ->find();
        return $term;
    }

    /**
     * 根据前台传过来的 schoolId ，获取该学校下激活状态的学期
     * 同时计算该学期下的总周数
     */
    public function getTermAndWeeksBySchoolId() {
        $request = Request::instance();
        $schoolId = IndexController::getParamId($request);

        // 查询对应学校激活状态的学期
        $term = Term::where('school_id', $schoolId)
            ->where('status', 1)
            ->find();

        // 计算总周数(如果 term 存在)
        if (!empty($term)) {
            $start = $term->start_time;
            $end = $term->end_time;
            // 将字符串解析成DateTime对象
            $startDate = new DateTime($start);
            $endDate = new DateTime($end);
            $interval = $startDate->diff($endDate);
            // 结束的那天是周一，也算一周
            $days = $interval->days + 7;
            $weekCount = $days / 7;
            $weekRange = range(1, $weekCount);

            $data = [
                'term' => $term,
                'weeks' => $weekRange
            ];

            return json(['success' => true, 'data' => $data]);

        } else {
            $data = [];
            return json(['success' => false, 'message' => '该学校下没有激活的学期', 'data' => $data]);
        }
    }

    /**
     * 学生
     * 根据当前登登录用户获取id(user表中的id)
     */
    public function getUserIdByLoginUser(){
        $Login = new LoginController();
        $response = $Login->currentLoginUser();
        $responseData = json_decode($response->getContent(), true);
        // 获取的是一个json字符串
        $data = $responseData['data'];
        // 转化成对象
        $user = json_decode($data);
        $id = $user->id;
        return $id;
    }

    /**
     * 根据学期获取周数
     */
    public function getWeek() {
        $term = $this->getTermByLoginUser();
        $start = $term->start_time;
        $end = $term->end_time;
        // 将字符串解析成DateTime对象
        $startDate = new DateTime($start);
        $endDate = new DateTime($end);
        $interval = $startDate->diff($endDate);
        // 结束的那天是周一，也算一周
        $days = $interval->days + 7;
        $weekCount = $days / 7;
        $weekRange = range(1, $weekCount);
        return $weekRange;
    }

    /**
     * 获取周数范围
     */
    public function getWeeksInRange($startWeek, $endWeek, $status) {
        // 全周
        $all = 3;
        // 双周
        $double = 1;
        // 单周
        $single = 2;
        $weekData = [];
        for ($weeks = $startWeek; $weeks <= $endWeek; $weeks++) {
            if (($status === $all)||
                ($status === $single && $weeks % 2 !== 0) || // 单周
                ($status === $double && $weeks % 2 === 0)) { // 双周
                $weekData[] = $weeks;
            }
        }
        return $weekData;
    }

    /**
     * 检查课程时间是否合法
     */
    public function isTimeLegal($data) {
        // 新课课程安排的信息
        $newStatus = $data['type'];
        $newStart = $data['start_weeks'];
        $newEnd = $data['end_weeks'];
        $newWeek = $data['week'];
        $newBegin = $data['begin'];
        $newLength = $data['end'] - $data['begin'] + 1;
        $newCourse = [
            'status' => $newStatus,
            'start_weeks' => $newStart,
            'end_weeks' => $newEnd,
            'week' => $newWeek,
            'begin' => $newBegin,
            'length' => $newLength
        ];

        // 学期id，班级id
        $term = $this->getTermByLoginUser();
        // 当前登录用户的学期id
        $termId = $term->id;
        // 当前登录用户的班级id
        $clazzId = $this->getClazzIdByLoginUser();
        $courses = Course::with('courseInfos')
                           ->where(['term_id' => $termId, 'clazz_id' => $clazzId])
                           ->select();
        // 获取旧课程的课程安排信息
        if (!empty($courses)) {
            foreach ($courses as $course) {
                foreach ($course->courseInfos as $courseInfo) {
                    $start = $courseInfo->start_weeks;
                    $end = $courseInfo->end_weeks;
                    $week = $courseInfo->week;
                    $begin = $courseInfo->begin;
                    $length = $courseInfo->length;
                    $status = $courseInfo->status;
                    $existingCourse[] = [
                        'status' => $status,
                        'start_weeks' => $start,
                        'end_weeks' => $end,
                        'week' => $week,
                        'begin' => $begin,
                        'length' => $length
                    ];
                    // 循环判断每个课程安排
                    foreach ($existingCourse as $courseData) {
                        if($this->isTimeConflict($newCourse, $courseData)) {
                            // 时间冲突，return false
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    /**
     * 检查周数是否重叠
     * @return boolean 有重叠，返回true
     */
    public function isTimeConflict($newCourse, $existingCourse) {
        // 获取新课程的周数范围
        $newWeeks = $this->getWeeksInRange((int)$newCourse['start_weeks'],
                                           (int)$newCourse['end_weeks'],
                                           (int)$newCourse['status']);
        // 获取旧课程的周数范围
        $existingWeeks = $this->getWeeksInRange($existingCourse['start_weeks'],
                                                $existingCourse['end_weeks'],
                                                $existingCourse['status']);
        // 检查星期几上课是否相同
        if ((int)$newCourse['week'] === $existingCourse['week']) {
            // 检查上课时间是否重叠，，如果上课时间重叠，检查是否是同一个周
            if ($newCourse['begin'] < $existingCourse['begin'] + $existingCourse['length'] &&
                $newCourse['begin'] + $newCourse['length'] > $existingCourse['begin']) {
                // 检查周数是否重叠
                foreach ($newWeeks as $newWeek) {
                    if (in_array($newWeek, $existingWeeks)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 搜索，包含分也所需要的数据
     */
    public function search() {
        // 获取查询参数
        $type = input('type', '', 'trim');
        $name = input('course', '', 'trim');
        $size = Request::instance()->get('size', 5);
        $currentPage = Request::instance()->get('currentPage', 1);

        // 构建查询条件
        $query = Db::name('course');
        // 根据班级id过滤课程
        $clazzId = $this->getClazzIdByLoginUser();
        $query->where('clazz_id', $clazzId);
        if (!empty($type)) {
            $query->where('type', $type);
        }
        if (!empty($name)) {
            $query->where('name', 'like', '%' . $name . '%');
        }

        // 获取课程id
        $courseIds = $query->column('id');
        //  如果当前班级没有对应的课程，返回空数据
        if (empty($courseIds)) {
            return json([
                'content' => [],
                'number' => $currentPage,
                'size' => $size,
                'numberOfElements' => 0,
                'totalPages' => 0,
            ]);
        }
        // 计算该课程有多少条课程安排
        $courseInfosQuery = CourseInfo::where('course_id', 'in', $courseIds);
        $dataQuery = clone $courseInfosQuery;
        $total = $courseInfosQuery->count();

        // 计算偏移量
        $offset = ($currentPage - 1) * $size;
        // 查询当前页的数据(courseInfo中的数据)

        $data = $dataQuery->limit($offset, $size)->select();

        // 根据课程id获取上课时间 一个上课时间对应的是一条数据
        // 处理获取的数据
        $dataDet = [];
        foreach ($data as $courseInfo) {
            $courseId = $courseInfo->course_id;
            $course = Course::where('id', $courseId)->find();
            $termId = $course->term_id;
            // 拼接周数范围
            $startWeeks = $courseInfo['start_weeks'];
            $endWeeks = $courseInfo['end_weeks'];
            $status = $courseInfo['status'];
            $weeksRange = $this->weeksRange($startWeeks, $endWeeks, $status);
            // 计算节次
            $start = $courseInfo->begin;
            $end = $courseInfo->begin + $courseInfo->length - 1;
            $range = "{$start}节-{$end}节";
            $dataDet[] = [
                'id' => $course->id,
                'name' => $course->name,
                'type' => $course->type,
                'term' => [
                    'id' => $termId,
                ],
                'courseInfoId' => $courseInfo['id'],
                'weeks' => $weeksRange,
                'week' => $this->weekMap($courseInfo->week),
                'range' => $range
            ];
        }
        // 构造分页结果
        $result = [
            'content' => $dataDet,
            'number' => $currentPage,
            'size' => $size,
            'numberOfElements' => $total,
            'totalPages' => ceil($total / $size),
        ];
        return json($result);
    }

    /**
     * 星期映射
     */
    public function weekMap($week) {
        $weekMap = [
            1 => '周一',
            2 => '周二',
            3 => '周三',
            4 => '周四',
            5 => '周五',
            6 => '周六',
            7 => '周日'
        ];
        $week = $weekMap[$week];
        return $week;
    }

    /**
     * 上课周数范围
     */
    public function weeksRange($start, $end, $status) {
        if ($status === 1) {
            $weeksRange = "{$start}-{$end}双";
            return $weeksRange;
        }
        if ($status === 2) {
            $weeksRange = "{$start}-{$end}单";
            return $weeksRange;
        }
        if ($status === 3) {
            $weeksRange = "{$start}-{$end}全";
            return $weeksRange;
        }
    }

    /**
     * 更新
     * 检查课程名是否合法
     * 检查课程时间是否合法
     */
    public function update() {
        // 获取课程安排id
        $request = Request::instance();
        $courseInfoId = IndexController::getParamId($request);
        $courseInfo = CourseInfo::get($courseInfoId);
        // 获取课程id
        $id = $courseInfo->course_id;

        // 获取JSON数据
        $content = Request::instance()->getContent();
        // 解析数据
        $data = json_decode($content, true);

        $userId = $this->getUserIdByLoginUser();
        $student = Student::where('user_id', $userId)->find();
        $studentId = $student->id;

        $length = $data['end'] - $data['begin'] + 1;
        // 先判断用户是否编辑了时间，如果时间没有改变，则不进行时间的验证
        $noChange = false;
        if ($data['status'] !== $courseInfo->status) {
            $noChange = true;
        }
        if ($data['start_weeks'] !== $courseInfo->start_weeks) {
            $noChange = true;
        }
        if ($data['end_weeks'] !== $courseInfo->end_weeks) {
            $noChange = true;
        }
        if ($data['week'] !== $courseInfo->week) {
            $noChange = true;
        }
        if ($data['begin'] !== $courseInfo->begin) {
            $noChange = true;
        }
        if ($length !== $courseInfo->length) {
            $noChange = true;
        }

        // 编辑了时间，检查时间是否合法
        if ($noChange) {
            if ($this->isTimeLegal($data)) {
                Db::startTrans();
                try {
                    // 准备更新数据
                    $updateData = [
                        'name' => $data['name'],
                        'type' => $data['type']
                    ];
                    // 根据type判断是否存studentId
                    if ($data['type'] === 1) {
                        $updateData['student_id'] = $studentId;
                    }
                    // 更新course表
                    Db::name('course')
                        ->where('id', $id)
                        ->update($updateData);

                    // 更新courseInfo表
                    Db::name('courseInfo')
                        ->where('id', $courseInfoId)
                        ->update([
                            'status' => $data['status'],
                            'start_weeks' => $data['start_weeks'],
                            'end_weeks' => $data['end_weeks'],
                            'week' => $data['week'],
                            'begin' => $data['begin'],
                            'length' => $length
                        ]);

                    // 提交事物
                    Db::commit();
                    return json(['success' => true, 'message' => '课程信息更新成功']);
                } catch (\Exception $e) {
                    Db::rollback();
                    return json(['success' => false, 'message' => $e->getMessage()]);
                }
            } else {
                return json(['success' => false, 'message' => '该时间段已有其它课程，请修改信息']);
            }
        } else {
            // 如果没有编辑时间，则只更新课程信息
            Db::startTrans();
            try {
                // 准备更新数据
                $updateData = [
                    'name' => $data['name'],
                    'type' => $data['type']
                ];
                // 根据type判断是否存studentId
                if ($data['type'] === 1) {
                    $updateData['student_id'] = $studentId;
                }
                // 更新course表
                Db::name('course')
                    ->where('id', $id)
                    ->update($updateData);

                // 提交事物
                Db::commit();
                return json(['success' => true, 'message' => '课程信息更新成功']);
            } catch (\Exception $e) {
                Db::rollback();
                return json(['success' => false, 'message' => $e->getMessage()]);
            }
        }
    }
}
