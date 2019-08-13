/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/13 13:54
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/13 13:54
 * @disc:Erase
 * after used, transfrom should be lock.Transform can not use with erase together
 */
import {AbsTool} from '@/Tools/AbsTool';
import Konva from 'konva';
import {Bind} from 'lodash-decorators';

class EraseTool extends AbsTool<Konva.Rect>{
    private eraseLine?:Konva.Line;
    @Bind
    protected onMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
        super.onMouseDown(e);
        const pos = this.canvas.stage.getPointerPosition();
        const {eraseSize} = this.config;
        this.eraseLine = new Konva.Line({
            globalCompositeOperation:"destination-out",
            lineCap: 'round',
            lineJoin: 'round',
            listening:false,
            points: [pos.x, pos.y],
            stroke:"blue",
            strokeWidth:eraseSize
        });
        this.canvas.staticLayer.add(this.eraseLine);
        this.canvas.staticLayer.batchDraw();
    }
    
    @Bind
    protected onMouseMove(e: Konva.KonvaEventObject<MouseEvent>): void {
        const pos = this.canvas.stage.getPointerPosition();
        const newPoints = this.eraseLine!.points().concat([pos.x, pos.y]);
        this.eraseLine!.points(newPoints);
        this.canvas.staticLayer.batchDraw();
    }
    @Bind
    protected onMouseUp(e: Konva.KonvaEventObject<MouseEvent>) {
        super.onMouseUp(e);
        this.eraseLine=undefined;
    }
}

export {EraseTool}