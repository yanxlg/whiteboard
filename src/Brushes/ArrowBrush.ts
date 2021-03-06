/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/5 15:47
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/5 15:47
 * @disc:ArrowBrush
 * draw on static layer
 */
import {LineBrush} from '@/Brushes/LineBrush';
import Konva from 'konva';

class ArrowBrush extends LineBrush{
    protected getObject(){
        const {color,strokeWidth} = this.context.config;
        return new Konva.Arrow({
            fill: color,
            points: [this.start!.x, this.start!.y, this.end!.x, this.end!.y],
            stroke: color,
            strokeWidth:strokeWidth
        });
    }
}

export {ArrowBrush};