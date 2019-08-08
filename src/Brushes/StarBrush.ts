/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/6 17:12
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/6 17:12
 * @disc:StarBrush
 */
import {AbsBrush} from '@/Brushes/AbsBrush';
import Konva from 'konva';

class StarBrush extends AbsBrush<Konva.Star>{
    protected getObject(): Konva.Star {
        const {fill,stroke,strokeWidth} = this.config;
        const offsetX = this.end!.x-this.start!.x;
        const offsetY = this.end!.y-this.start!.y;
        const radius = Math.min(Math.abs(offsetX),Math.abs(offsetY))/2;
        const ratio = 3 - 4*(Math.pow(Math.sin(Math.PI/10),2));
        return new Konva.Star({
            fill: fill,
            innerRadius: radius/ratio,
            numPoints: 5,
            outerRadius: radius,
            stroke: stroke,
            strokeWidth: strokeWidth,
            x: this.start!.x+(offsetX>0?radius:-radius),
            y: this.start!.y+(offsetY>0?radius:-radius)
        });
    }
    
    protected updateObject(): void {
        const offsetX = this.end!.x-this.start!.x;
        const offsetY = this.end!.y-this.start!.y;
        const radius = Math.min(Math.abs(offsetX),Math.abs(offsetY))/2;
        const ratio = 3 - 4*(Math.pow(Math.sin(Math.PI/10),2));
        this.object!.outerRadius(radius);
        this.object!.innerRadius(radius/ratio);
        this.object!.x(this.start!.x+(offsetX>0?radius:-radius));
        this.object!.y(this.start!.y+(offsetY>0?radius:-radius));
        this.canvas.brushLayer.draw();
    }
}

export {StarBrush}