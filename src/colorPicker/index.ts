/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/27 9:41
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/27 9:41
 * @disc:export
 */
///////// color picker //////////////
require("@/colorPicker/colors");
require("@/colorPicker/colorPicker.data");
require("@/colorPicker/colorPicker");


declare global {
    // tslint:disable-next-line:interface-name
    interface Window { ColorPicker: any; }
}
const ColorPicker = window.ColorPicker;

export {
    ColorPicker
}