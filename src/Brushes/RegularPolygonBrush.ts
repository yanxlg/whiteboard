/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/6 18:04
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/6 18:04
 * @disc:PolygonBrush
 */
import {AbsBrush} from '@/Brushes/AbsBrush';
import Konva from 'konva';

class RegularPolygonBrush extends AbsBrush<Konva.RegularPolygon>{
    protected getObject(): Konva.RegularPolygon {
        const {stroke,fill,strokeWidth} = this.config;
        const offsetX = this.end!.x-this.start!.x;
        const offsetY = this.end!.y-this.start!.y;
        const radius = Math.min(Math.abs(offsetX),Math.abs(offsetY))/2;
        return new Konva.RegularPolygon({
            fill: fill,
            radius: radius,
            sides: 6,
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
    
        this.object!.x(this.start!.x+(offsetX>0?radius:-radius));
        this.object!.y(this.start!.y+(offsetY>0?radius:-radius));
        this.object!.radius(radius);
        this.canvas.brushLayer.draw();
    }
}

export {RegularPolygonBrush}