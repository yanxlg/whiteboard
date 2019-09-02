/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/6 10:29
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/6 10:29
 * @disc:RectBrush
 * support Square by keyboardEvent
 */
import {SquareBrush} from '@/Brushes/SquareBrush';
import {Bind} from 'lodash-decorators';

class RectBrush extends SquareBrush{
    protected _shiftKey:boolean=false;
    protected attachEvents(){
        super.attachEvents();
        document.addEventListener("keydown",this.onKeyDown);
        document.addEventListener("keyup",this.onKeyUp);
    }
    protected detachEvents(){
        super.detachEvents();
        document.removeEventListener("keydown",this.onKeyDown);
        document.removeEventListener("keyup",this.onKeyUp);
    }
    @Bind
    private onKeyDown(ev:KeyboardEvent){
        const {key,keyCode} = ev;
        if(key==="Shift"||keyCode===16){
            this.shiftKey=true;
        }
    }
    @Bind
    private onKeyUp(ev:KeyboardEvent){
        const {key,keyCode} = ev;
        if(key==="Shift"||keyCode===16){
            this.shiftKey=false;
        }
    }
}

export {RectBrush};