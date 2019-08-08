/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/6 17:52
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/6 17:52
 * @disc:ArcBrush
 */
import {AbsBrush} from '@/Brushes/AbsBrush';
import Konva from 'konva';

class ArcBrush extends AbsBrush<Konva.Arc>{
    protected getObject(): Konva.Arc {
        const {fill,strokeWidth,stroke} = this.config;
        const offsetX = this.end!.x-this.start!.x;
        const offsetY = this.end!.y-this.start!.y;
        const radius = Math.abs(offsetY);
        const width = Math.abs(offsetX);
        const degree = Math.atan(radius/(width/2))/Math.PI*180;
        const angle = 180 - degree*2;
        const rotation = degree-180;
        const innerRadius = radius>60?radius-30:radius*0.5;
        
        return new Konva.Arc({
            angle: angle,
            fill: fill,
            innerRadius: innerRadius,
            outerRadius: radius,
            rotation: rotation,
            stroke: stroke,
            strokeWidth: strokeWidth,
            x: this.start!.x+offsetX/2,
            y: this.start!.y+offsetY+(offsetY>0?0:radius),
        });
    }
    
    protected updateObject(): void {
        const offsetX = this.end!.x-this.start!.x;
        const offsetY = this.end!.y-this.start!.y;
        const radius = Math.abs(offsetY);
        const width = Math.abs(offsetX);
        const degree = Math.atan(radius/(width/2))/Math.PI*180;
        const angle = 180 - degree*2;
        const rotation = degree-180;
        const innerRadius = radius>60?radius-30:radius*0.5;
        
        this.object!.innerRadius(innerRadius);
        this.object!.outerRadius(radius);
        this.object!.angle(angle);
        this.object!.rotation(rotation);
        this.object!.x(this.start!.x+offsetX/2);
        this.object!.y(this.start!.y+offsetY+(offsetY>0?0:radius));
        this.canvas.brushLayer.draw();
    }
}

export {ArcBrush}