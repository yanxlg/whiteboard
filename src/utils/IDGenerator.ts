/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/9/2 9:16
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/9/2 9:16
 * @disc:IDGenerator
 */

class IDGenerator {
    public static getTabId(){
        return `tab_${Date.now().toString()}`;
    }
    public static getMessageId(){
        return `msg_${Date.now().toString()}`;
    }
}

export {IDGenerator}