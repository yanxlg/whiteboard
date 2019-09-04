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
import {Cursor} from '@/cursor/Cursor';
import Konva from 'konva';
import {Bind} from 'lodash-decorators';

class PencilBrush extends AbsBrush<Konva.Path>{
    public cursor:Cursor=Cursor.hand;
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
        };
        canvas.stage.content.style.cursor = this.cursor as string;
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
        this.canvas.stage.content.style.cursor = Cursor.default as string;
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
        }else if(this.points.length>1){
            const line = new Konva.Path({
                data:this.convertPointsToSVGPath().join(""),
                lineCap:"round",
                lineJoin:"round",
                stroke: color,
                strokeWidth: strokeWidth,
            });
            this.canvas.staticLayer.add(line);
            this.canvas.staticLayer.draw();
        }
        this.canvas.brushLayer.destroyChildren();
        this.canvas.brushLayer.clear();
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
    private convertPointsToSVGPath() {
        const points = this.points;
        const path=[];
        let i;
        const width = this.context.config.strokeWidth;
        let p1 = points[0];
        let p2=points[1];
        const len = points.length;
        let multSignX = 1;
        let multSignY = 1;
        const manyPoints = len > 2;
        
        if (manyPoints) {
            multSignX = points[2].x < p2.x ? -1 : points[2].x === p2.x ? 0 : 1;
            multSignY = points[2].y < p2.y ? -1 : points[2].y === p2.y ? 0 : 1;
        }
        path.push('M ', p1.x - multSignX * width, ' ', p1.y - multSignY * width, ' ');
        for (i = 1; i < len; i++) {
            if (!(p1.x===p2.x&&p1.y===p2.y)) {
                const midPoint = this.midPointFrom(p1,p2);
                // p1 is our bezier control point
                // midpoint is our endpoint
                // start point is p(i-1) value.
                path.push('Q ', p1.x, ' ', p1.y, ' ', midPoint.x, ' ', midPoint.y, ' ');
            }
            p1 = points[i];
            if ((i + 1) < points.length) {
                p2 = points[i + 1];
            }
        }
        if (manyPoints) {
            multSignX = p1.x > points[i - 2].x ? 1 : p1.x === points[i - 2].x ? 0 : -1;
            multSignY = p1.y > points[i - 2].y ? 1 : p1.y === points[i - 2].y ? 0 : -1;
        }
        path.push('L ', p1.x + multSignX * width, ' ', p1.y + multSignY * width);
        return path;
    }
}

export {PencilBrush}