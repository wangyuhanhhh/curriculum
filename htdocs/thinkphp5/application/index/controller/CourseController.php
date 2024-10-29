<?php
namespace app\index\controller;
use think\Request;
use app\common\model\Course;

class CourseController extends IndexController {
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
        $query = Course::with('courseInfos');

        if (!empty($type)) {
            $query->where('type', $type);
        }
        if (!empty($name)) {
            $query->where('name', 'like', '%' . $name . '%');
        }
        // 克隆查询对象，计算查询总记录数
        $countQuery = clone $query;
        $total = $countQuery->count();
        // 计算偏移量
        $offset = ($currentPage - 1) * $size;
        // 查询当前页的数据
        $data = $query->limit($offset, $size)->select();

        // 星期映射
        $weekMap = [
            1 => '周一',
            2 => '周二',
            3 => '周三',
            4 => '周四',
            5 => '周五',
            6 => '周六',
            7 => '周日'
        ];
        // 根据课程id获取上课时间 一个上课时间对应的是一条数据
        // 处理获取的数据
        foreach ($data as $course) {
            if (!empty($course->courseInfos)) {
                $courseInfos = $course->courseInfos;
                foreach ($courseInfos as $courseInfo) {
                    // 计算节次
                    $start = $courseInfo->begin;
                    $end = $courseInfo->begin + $courseInfo->length - 1;
                    $range = "{$start}节-{$end}节";
                    $dataDet[] = [
                        'id' => $course->id,
                        'name' => $course->name,
                        'type' => $course->type,
                        'weeks' => $courseInfo->weeks,
                        'week' => $weekMap[$courseInfo->week],
                        'range' => $range
                    ];
                }
            }
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
}