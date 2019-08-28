/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/12 11:32
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/12 11:32
 * @disc:PencilBrush
 */
import {AbsBrush} from '@/Brushes/AbsBrush';
import {Canvas} from '@/Canvas';
import {Context} from '@/Context';
import Konva from 'konva';
import {Bind} from 'lodash-decorators';

class PencilBrush extends AbsBrush<Konva.Line>{
    private brushContext?:CanvasRenderingContext2D;
    private points:Konva.Vector2d[];
    private oldEnd?:Konva.Vector2d;
    private tension:number=0.5;
    private originStyle:{strokeStyle:any;lineWidth:number;lineCap:any;lineJoin:any;fillStyle:any};
    constructor(canvas:Canvas, context:Context){
        super(canvas,context);
        // brushLayer Context
        this.brushContext=canvas.brushLayer.getContext()._context;
        this.points=[];
        this.originStyle={
            fillStyle:this.brushContext.fillStyle,
            lineCap:this.brushContext.lineCap,
            lineJoin:this.brushContext.lineJoin,
            lineWidth:this.brushContext.lineWidth,
            strokeStyle:this.brushContext.strokeStyle
        }
    }
    @Bind
    public destroy(): void {
        super.destroy();
        if(this.brushContext){
            this.brushContext!.lineJoin=this.originStyle.lineJoin;
            this.brushContext!.lineCap=this.originStyle.lineCap;
            this.brushContext!.strokeStyle=this.originStyle.strokeStyle;
            this.brushContext!.lineWidth=this.originStyle.lineWidth;
            this.brushContext!.fillStyle=this.originStyle.fillStyle;
        }
        this.brushContext=undefined;
    }
    protected getObject():any{
        return undefined;
    }
    
    protected updateObject(): void {
        //
    }
 
    @Bind
    protected onMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
        super.onMouseDown(e);
        const {color,strokeWidth} = this.context.config;
        
        const _oldFillStyle=this.brushContext!.fillStyle;
        
        // update context style
        this.brushContext!.strokeStyle=color;
        this.brushContext!.fillStyle=color;
        this.brushContext!.lineWidth=strokeWidth;
        this.brushContext!.lineCap="round";
        this.brushContext!.lineJoin="round";
        
        const point = this.canvas.stage!.getPointerPosition();
        this.points=[];
        this.addPoint(point);
        this.brushContext!.save();// transform 还原
        this.brushContext!.beginPath();
        this.brushContext!.arc(point.x,point.y,strokeWidth/2,0,Math.PI*2);
        this.brushContext!.fill();
        this.brushContext!.restore();
        this.brushContext!.moveTo(point.x, point.y);
        this.brushContext!.fillStyle=_oldFillStyle;
    }
    @Bind
    protected onMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
        const point = this.canvas.stage.getPointerPosition();
        this.addPoint(point);
        const points = this.points;
        const length = points.length;
        if (length > 1) {
            this.brushContext!.save();// transform 还原
            this.brushContext!.beginPath();
            if (this.oldEnd) {
                this.brushContext!.moveTo(this.oldEnd.x, this.oldEnd.y);
            }
            this.oldEnd = this._drawSegment( points[length - 2], points[length - 1]);
            this.brushContext!.stroke();
            this.brushContext!.restore();
        }
    }
    @Bind
    protected onMouseUp(e: Konva.KonvaEventObject<MouseEvent>) {
        super.onMouseUp(e);
        this.oldEnd = undefined;
        this.brushContext!.closePath();

        const {color,strokeWidth} = this.context.config;
        // 如果一个点
        if(this.points.length===1){
            const point = this.points[0];
            const circle = new Konva.Circle({
                fill:color,
                radius:strokeWidth/2,
                x: point.x,
                y: point.y
            });
            this.canvas.staticLayer.add(circle);
            this.canvas.staticLayer.draw();
        }else{
            const _points:number[]=[];
            this.points.forEach((point)=>{
                _points.push(point.x,point.y);
            });
            const line = new Konva.Line({
                lineCap: 'round',
                lineJoin: 'round',
                points:_points,
                stroke: color,
                strokeWidth: strokeWidth,
                tension: this.tension
            });
            this.canvas.staticLayer.add(line);
            this.canvas.staticLayer.draw();
        }
        this.brushContext!.clearRect(0,0,this.canvas.stage.width(),this.canvas.stage.height());
    }
    @Bind
    private addPoint(point:Konva.Vector2d){
        if (this.points.length > 0) {
            const lastPoint = this.points[this.points.length-1];
            if(point.x===lastPoint.x&&point.y===lastPoint.y){
                return false;
            }
        }
        this.points.push(point);
        return true;
    }
    @Bind
    private _drawSegment(p1:Konva.Vector2d, p2:Konva.Vector2d) {
        const midPoint = this.midPointFrom(p1,p2);
        this.brushContext!.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        return midPoint;
    }
    @Bind
    private midPointFrom(from:Konva.Vector2d,to:Konva.Vector2d){
        const t = Math.max(Math.min(1, this.tension), 0);
        return {
            x:from.x+(to.x - from.x) * t,
            y:from.y + (to.y - from.y) * t
        }
    }
}

export {PencilBrush}