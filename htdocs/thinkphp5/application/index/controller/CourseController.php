<?php
namespace app\index\controller;
use DateTime;
use think\Request;
use think\Db;
use app\common\model\Course;
use app\common\model\CourseInfo;
use app\common\model\Student;
use app\common\model\Clazz;
use app\common\model\Term;

class CourseController extends IndexController {
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
                return json(['success' => false, 'message' => '当前用户没有激活的学期，请先激活学期']);
            }
        } else {
            return json(['success' => false, 'message' => '当前用户没有学期信息，请先添加学期']);
        }
        return json(['success' => true]);
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

        if (!empty($type)) {
            $query->where('type', $type);
        }
        if (!empty($name)) {
            $query->where('name', 'like', '%' . $name . '%');
        }

        // 获取课程id
        $courseIds = $query->column('id');

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
            // 计算节次
            $start = $courseInfo->begin;
            $end = $courseInfo->begin + $courseInfo->length - 1;
            $range = "{$start}节-{$end}节";
            $dataDet[] = [
                'id' => $course->id,
                'name' => $course->name,
                'type' => $course->type,
                'courseInfoId' => $courseInfo['id'],
                'weeks' => $courseInfo['start_weeks'],
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