/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/12 11:32
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/12 11:32
 * @disc:PencilBrush
 */
import {AbsBrush} from '@/Brushes/AbsBrush';
import {Canvas} from '@/Canvas';
import {Config} from '@/Config';
import Konva from 'konva';
import {Bind} from 'lodash-decorators';

class PencilBrush extends AbsBrush<Konva.Line>{
    private context?:CanvasRenderingContext2D;
    private points:Konva.Vector2d[];
    private oldEnd?:Konva.Vector2d;
    private tension:number=0.5;
    private originStyle:{strokeStyle:any;lineWidth:number;lineCap:any;lineJoin:any;fillStyle:any};
    constructor(canvas:Canvas, config:Config){
        super(canvas,config);
        // brushLayer Context
        this.context=canvas.brushLayer.getContext()._context;
        this.points=[];
        this.originStyle={
            fillStyle:this.context.fillStyle,
            lineCap:this.context.lineCap,
            lineJoin:this.context.lineJoin,
            lineWidth:this.context.lineWidth,
            strokeStyle:this.context.strokeStyle
        }
    }
    @Bind
    public destroy(): void {
        super.destroy();
        this.context!.lineJoin=this.originStyle.lineJoin;
        this.context!.lineCap=this.originStyle.lineCap;
        this.context!.strokeStyle=this.originStyle.strokeStyle;
        this.context!.lineWidth=this.originStyle.lineWidth;
        this.context!.fillStyle=this.originStyle.fillStyle;
        
        this.context=undefined;
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
        const {stroke,strokeWidth} = this.config;
        // update context style
        this.context!.strokeStyle=stroke;
        this.context!.fillStyle=stroke;
        this.context!.lineWidth=strokeWidth;
        this.context!.lineCap="round";
        this.context!.lineJoin="round";
        
        
        const point = this.canvas.stage.getPointerPosition();
        this.points=[];
        this.addPoint(point);
        this.context!.save();// transform 还原
        this.context!.arc(point.x,point.y,strokeWidth/2,0,Math.PI*2);
        this.context!.fill();
        this.context!.restore();
        this.context!.moveTo(point.x, point.y);
    }
    @Bind
    protected onMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
        const point = this.canvas.stage.getPointerPosition();
        this.addPoint(point);
        const points = this.points;
        const length = points.length;
        if (length > 1) {
            this.context!.save();// transform 还原
            this.context!.beginPath();
            if (this.oldEnd) {
                this.context!.moveTo(this.oldEnd.x, this.oldEnd.y);
            }
            this.oldEnd = this._drawSegment( points[length - 2], points[length - 1]);
            this.context!.stroke();
            this.context!.restore();
        }
    }
    @Bind
    protected onMouseUp(e: Konva.KonvaEventObject<MouseEvent>) {
        super.onMouseUp(e);
        this.oldEnd = undefined;
        this.context!.closePath();

        const {stroke,strokeWidth} = this.config;
        // 如果一个点
        if(this.points.length===1){
            const point = this.points[0];
            const circle = new Konva.Circle({
                fill:stroke,
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
                stroke: stroke,
                strokeWidth: strokeWidth,
                tension: this.tension
            });
            this.canvas.staticLayer.add(line);
            this.canvas.staticLayer.draw();
        }
        this.context!.clearRect(0,0,this.canvas.stage.width(),this.canvas.stage.height());
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
        this.context!.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
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