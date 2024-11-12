<?php
namespace app\index\controller;
use think\Controller;
class DingTalkMsgController extends Controller
{
    protected $webhook = "https://oapi.dingtalk.com/robot/send?access_token=c78ef9e11a1b591c00e603f461c0b1b85e2879350767aae79399526728508c3c";

    /**
     * 发送消息到钉钉
     */
    public function sendMessage()
    {
        $schedule = [
            ["name" => "张三", "section" => "1"],
            ["name" => "李四", "section" => "4"],
            ["name" => "王五", "section" => "7"],
            ["name" => "赵六", "section" => "4"],
        ];

        $tableText = "### 课表\n\n";
        $tableText .= "| 姓名 |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |  9  |  10  |  11  |\n";
        $tableText .= "| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |\n";
        foreach ($schedule as $clazz) {
            // 初始化每个时间段的状态未空
            $row = array_fill(1, 11, " ");

            // 根据 `section` 字段的值在对应位置标记 “有课”
            $row[$clazz['section']] = '有课';

            // 生成每一行的表格内容
            $tableText .= "| {$clazz['name']} | " . implode(" | ", $row) . "\n";
        }

        // 构造消息体，消息类型可以是 markdown、text、feedCard 等
        $data = [
            "msgtype" => "markdown",
            "markdown" => [
                "title" => "课表",
                "text" => $tableText
            ]
        ];

        $this->sendWebhookRequest($data);
    }


    /**
     * 发送 Webhook 请求
     */
    private function sendWebhookRequest($data)
    {

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