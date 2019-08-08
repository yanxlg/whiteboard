/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/6 15:25
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/6 15:25
 * @disc:WedgeBrush
 */
import {AbsBrush} from '@/Brushes/AbsBrush';
import Konva from 'konva';

class WedgeBrush extends AbsBrush<Konva.Wedge>{
    protected getObject(): Konva.Wedge {
        const {fill,strokeWidth,stroke} = this.config;
        const offsetX = this.end!.x-this.start!.x;
        const offsetY = this.end!.y-this.start!.y;
        const radius = Math.abs(offsetY);
        const width = Math.abs(offsetX);
        const degree = Math.atan(radius/(width/2))/Math.PI*180;
        const angle = 180 - degree*2;
        const rotation = degree-180;
        return new Konva.Wedge({
            angle: angle,
            fill,
            radius: radius,
            rotation: rotation,
            stroke,
            strokeWidth,
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
        this.object!.angle(angle);
        this.object!.radius(radius);
        this.object!.rotation(rotation);
        this.object!.x(this.start!.x+offsetX/2);
        this.object!.y(this.start!.y+offsetY+(offsetY>0?0:radius));
        this.canvas.brushLayer.draw();
    }
}

export {WedgeBrush}