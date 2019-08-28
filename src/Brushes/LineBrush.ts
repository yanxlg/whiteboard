/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/5 17:19
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/5 17:19
 * @disc:LineBrush
 */
import {AbsBrush} from '@/Brushes/AbsBrush';
import Konva from 'konva';

class LineBrush extends AbsBrush<Konva.Line>{
    
    protected getObject(){
        const {stroke,strokeWidth} = this.context.config;
        return new Konva.Line({
            fill: stroke,
            points: [this.start!.x, this.start!.y, this.end!.x, this.end!.y],
            stroke: stroke,
            strokeWidth:strokeWidth
        });
    }
    
    protected updateObject(){
        this.object!.points([this.start!.x, this.start!.y, this.end!.x, this.end!.y]);
        this.canvas.brushLayer.draw();
    }
}

export {LineBrush}