/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/5 18:17
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/5 18:17
 * @disc:CircleBrush
 */
import {AbsBrush} from '@/Brushes/AbsBrush';
import Konva from 'konva';

class CircleBrush extends AbsBrush<Konva.Circle>{
    protected getObject():Konva.Circle{
        const {stroke,fill,strokeWidth} = this.config;
        const offsetX = this.end!.x-this.start!.x;
        const offsetY = this.end!.y-this.start!.y;
        const radius = Math.min(Math.abs(offsetX),Math.abs(offsetY))/2;
        return new Konva.Circle({
            fill,
            radius,
            stroke,
            strokeWidth:stroke?strokeWidth:0,
            x: this.start!.x+(offsetX>0?radius:-radius),
            y: this.start!.y+(offsetY>0?radius:-radius)
        });
    }
    protected updateObject(){
        const offsetX = this.end!.x-this.start!.x;
        const offsetY = this.end!.y-this.start!.y;
        const radius = Math.min(Math.abs(offsetX),Math.abs(offsetY))/2;
        this.object!.radius(radius);
        this.object!.x(this.start!.x+(offsetX>0?radius:-radius));
        this.object!.y(this.start!.y+(offsetY>0?radius:-radius));
        this.canvas.brushLayer.draw();
    }
}

export {CircleBrush}