/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/6 17:29
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/6 17:29
 * @disc:RingBrush
 */
import {AbsBrush} from '@/Brushes/AbsBrush';
import Konva from 'konva';

class RingBrush extends AbsBrush<Konva.Ring>{
    protected getObject(): Konva.Ring {
        const {color,strokeWidth} = this.context.config;
        const offsetX = this.end!.x-this.start!.x;
        const offsetY = this.end!.y-this.start!.y;
        const radius = Math.min(Math.abs(offsetX),Math.abs(offsetY))/2;
        const innerRadius = radius>60?radius-30:radius*0.5;
        return new Konva.Ring({
            fill: this.hollowState?undefined:color,
            innerRadius: innerRadius,
            outerRadius: radius,
            stroke: this.hollowState?color:undefined,
            strokeWidth: this.hollowState?strokeWidth:undefined,
            x: this.start!.x+(offsetX>0?radius:-radius),
            y: this.start!.y+(offsetY>0?radius:-radius)
        });
    }
    
    protected updateObject(): void {
        const offsetX = this.end!.x-this.start!.x;
        const offsetY = this.end!.y-this.start!.y;
        const radius = Math.min(Math.abs(offsetX),Math.abs(offsetY))/2;
        const innerRadius = radius>60?radius-30:radius*0.5;
        this.object!.innerRadius(innerRadius);
        this.object!.outerRadius(radius);
        this.object!.x( this.start!.x+(offsetX>0?radius:-radius));
        this.object!.y( this.start!.y+(offsetY>0?radius:-radius));
        this.canvas.brushLayer.draw();
    }
}

export {RingBrush}