<?php
namespace app\index\controller;

use app\common\model\Course;
use app\common\model\CourseInfo;
use app\common\model\Student;
use DateTime;
use think\Controller;
use app\common\model\Term;
use app\common\model\Clazz;
use app\common\model\School;
class DingTalkMsgController extends Controller
{
    protected $webhook = "https://oapi.dingtalk.com/robot/send?access_token=c78ef9e11a1b591c00e603f461c0b1b85e2879350767aae79399526728508c3c";

    private $doubleWeek = 1;    // 双周
    private $singleWeek = 2;    // 单周

    /**
     * @param $endTime
     * 检查学期是否过期
     * @return boolean
     */
    public function checkIsExpired($endTime) {
        // 获取当前时间戳
        $currentTime = time();
        $endTimeStamp = strtotime($endTime);

        if ($currentTime > $endTimeStamp) {
            return true;  // 表示已过期
        } else {
            return false; // 表示未过期
        }
    }

    /**
     * 转化 getMessage 的返回值类型
     * 以便得到符合 sendMessage 方法所需要的数据
     */
    public function convert($courseInfoList) {
        $schedule = [];

        // 遍历课程信息列表， 提取学生姓名和小节
        foreach ($courseInfoList as $courseInfo) {
            // 检查该课程信息中是否有学生姓名
            if (!empty($courseInfo['students'])) {
                foreach ($courseInfo['students'] as $student) {
                    // 计算课程的所有小节（从 `begin` 开始，持续 `length` 小节）
                    $sections = range($courseInfo['begin'], $courseInfo['begin'] + $courseInfo['length'] - 1);

                    $schedule[] = [
                        'name' => $student,
                        'sections' => $sections, // 将小节信息映射为 sections，使用数组表示多个小节
                    ];
                }
            }
        }
        return $schedule;
    }

    /**
     * 根据学校id获取对应的激活学期的数组
     */
    public function getActiveTerm() {
        // 根据 schoolId 获取当前激活学期
        $schools = $this->getSchoolIds();
        $activeTerms = [];

        foreach ($schools as $id) {
            $activeTerm = Term::where('school_id', $id)->where('status', 1)->find();

                if ($activeTerm) {
                    // 如果找到激活学期，将学校 ID 和学期信息存入数组
                    $activeTerms[] = [
                        'schoolId' => $id,
                        'term' => $activeTerm
                    ];
                }
            }

        return $activeTerms;
    }

    /**
     * @param $schoolId
     * 根据 schoolId 获取所有班级id
     * @return array
     */
    public function getClazzIdsBySchool($schoolId) {
        $clazzIds = Clazz::where('school_id', $schoolId)->column('id');
        return $clazzIds;
    }

    /**
     * 获取所有学校id
     * @return array
     */
    public function getSchoolIds() {
        $schools = School::column('id');
        return $schools;
    }


    public function getNowTime($startTime, $endTime) {
        // 判断是否过期
        $expired = $this->checkIsExpired($endTime);

        if (!$expired) {
            // 未过期，计算当前是第几周、星期几
            $currentDate = new DateTime();
            $startDate = new DateTime($startTime);

            // 计算从开始日期到当前日期的天数差
            $dayDiff = $startDate->diff($currentDate)->days;

            // 计算当前是第几周（取整加一）
            $currentWeek = (int)($dayDiff / 7) + 1;

            // 计算当前是星期几( 1 表示星期一；7 表示星期天)
            $currentDayOfWeek = $currentDate->format('N');

            return [
                'week' => $currentWeek,
                'dayOfWeek' => $currentDayOfWeek
            ];
        } else {
            return "当前时间不在学期范围内";
        }
    }

    public function getMessage() {
        // 定义总的课程信息列表（在循环外部），确保不会被覆盖
        $courseInfoList = [];

        // 根据 termId 和 schoolId，在 Course 表中获取课程列表
        $termList = $this->getActiveTerm();

        // 遍历每个激活学期，处理课程信息
        foreach ($termList as $term) {
            $startTime = $term['term']->start_time;
            $endTime = $term['term']->end_time;
            // 获取当前是第几周（currentWeek），星期几（currentDayOfWeek）
            $nowTime = $this->getNowTime($startTime, $endTime);

            if ($nowTime == "当前时间不在学期范围内") {
                continue;   // 提前结束循环
            }
            $currentWeek = $nowTime['week'];
            $currentDayOfWeek = $nowTime['dayOfWeek'];

            // 获取该 schoolId 下的所有班级
            $clazzIds = $this->getClazzIdsBySchool($term['schoolId']);

            // 获取课程列表
            $courseList = [];
            $rqCourseInfoList = [];
            $etCourseInfoList = [];

            if ($clazzIds) {
                foreach ($clazzIds as $clazzId) {
                    $courses = Course::where('clazz_id', $clazzId)
                        ->where('term_id', $term['term']->id)
                        ->column('id, clazz_id, type, student_id');

                    $courseList = array_merge($courseList, $courses);
                }

                $statusFilter = ($currentWeek % 2 == 1) ? $this->doubleWeek : $this->singleWeek;

                // 处理课程信息
                foreach ($courseList as $course) {
                    if (is_null($course['student_id'])) {
                        // 必修课
                        $rqCourseInfo = CourseInfo::where('course_id', $course['id'])
                            ->where('start_weeks', '<=', $currentWeek)
                            ->where('end_weeks', '>=', $currentWeek)
                            ->where('status', 'neq', $statusFilter)
                            ->where('week', $currentDayOfWeek + 1) // 数据库中的 week 字段指的是周几上课（这里需要获取明天的课程安排）
                            ->select();

                        $students = Student::where('clazz_id', $course['clazz_id'])->column('name');

                        foreach ($rqCourseInfo as $info) {
                            $info['students'] = $students;
                            $courseInfoList[] = $info; // 将每条记录添加到总列表中
                        }
                    } else {
                        // 选修课
                        $etCourseInfo = CourseInfo::where('course_id', $course['id'])
                            ->where('start_weeks', '<=', $currentWeek)
                            ->where('end_weeks', '>=', $currentWeek)
                            ->where('status', 'neq', $statusFilter)
                            ->where('week', $currentDayOfWeek + 1) // 数据库中的 week 字段指的是周几上课（这里需要获取明天的课程安排）
                            ->select();

                        $student = Student::where('id', $course['student_id'])->find();

                        foreach ($etCourseInfo as $info) {
                            $info['students'] = [$student->name];
                            $courseInfoList[] = $info; // 将每条记录添加到总列表中
                        }
                    }
                }
            }
        }
        // 将所有积累的课程信息传递给 convert 方法，进行转化
        $data = $this->convert($courseInfoList);
        return $data;
    }
    /**
     * 发送消息到钉钉
     */
    public function sendMessage() {
        $schedule = $this->getMessage();

        $tableText = "### 课表\n\n";
        $tableText .= "| 姓名 |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |  9  |  10  |  11  |\n";
        $tableText .= "| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |\n";

        // 按学生姓名分组，生成表格
        $students = [];
        foreach ($schedule as $info) {
             $name = $info['name'];
             if (!isset($students[$name])) {
                 $students[$name] = array_fill(1, 11, " ");
             }

            // 标记每个小节为 “有课”
           foreach ($info['sections'] as $section) {
               $students[$name][$section] = '有课';
           }
        }

        // 拼接每位学生的课表行
        foreach ($students as $name => $row) {
            $tableText .= "| {$name} | " . implode(" | ", $row) . "\n";
        }

        // 构造消息体，消息类型可以是 markdown、text、feedCard 等
        $data = [
            "msgtype" => "markdown",
            "markdown" => [
                "title" => "明日课表",
                "text" => $tableText
            ]
        ];

        $this->sendWebhookRequest($data);
    }


    /**
     * 发送 Webhook 请求
     */
    private function sendWebhookRequest($data) {

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->webhook);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        curl_close($ch);

        return $result;
    }

}