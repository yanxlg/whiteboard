/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/5 15:47
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/5 15:47
 * @disc:IBrush
 */
import {Canvas} from '@/Canvas';
import {Context} from '@/Context';
import {Cursor} from '@/cursor/Cursor';
import Konva from 'konva';
import {Bind} from 'lodash-decorators';

export interface IBrush{
    destroy():void;
}



abstract class AbsBrush<T extends Konva.Shape> implements IBrush{
    public cursor:Cursor=Cursor.cross;
    public context:Context;
    protected canvas:Canvas;
    protected object?:T;
    protected start?:Konva.Vector2d;
    protected end?:Konva.Vector2d;
    protected hollowState?:boolean=false;
    constructor(canvas:Canvas, context:Context,isHollow?:boolean){
        this.context=context;
        this.canvas=canvas;
        this.hollowState=isHollow;
        this.attachEvents();
        canvas.stage.content.style.cursor=this.cursor as string;
    }
    public destroy():void{
        this.detachEvents();
        this.object=undefined;
        this.start=undefined;
        this.end=undefined;
        this.canvas.stage.content.style.cursor=Cursor.default as string;
    };
    protected abstract updateObject():void;
    protected abstract getObject():T;
    protected attachEvents(){
        this.canvas.stage!.on(Context.mouseDownEvents,this.onMouseDown);
        this.canvas.stage!.on(Context.mouseMoveEvents,this.onLayerMouseMove);
        this.canvas.stage!.on(Context.mouseUpEvents,this.onMouseUp);
        this.canvas.stage!.on(Context.mouseOutEvents,this.onMouseOut);
    }
    
    protected detachEvents(){
        this.canvas.stage!.off(Context.mouseDownEvents,this.onMouseDown);
        this.canvas.stage!.off(Context.mouseMoveEvents,this.onLayerMouseMove);
        this.canvas.stage!.off(Context.mouseUpEvents,this.onMouseUp);
        this.canvas.stage!.off(Context.mouseOutEvents,this.onMouseOut);
    }
    
    @Bind
    protected onMouseDown(e:Konva.KonvaEventObject<MouseEvent>){
        this.start = this.canvas.stage!.getPointerPosition();
    }
    @Bind
    protected onLayerMouseMove(e:Konva.KonvaEventObject<MouseEvent>){
        if(this.start){
            this.end = this.canvas.stage!.getPointerPosition();
            this.onMouseMove(e);
        }
    }
    @Bind
    protected onMouseMove(e:Konva.KonvaEventObject<MouseEvent>){
        this.drawShape();
    }
    @Bind
    protected onMouseUp(e:Konva.KonvaEventObject<MouseEvent>){
        // 将arrow移动到staticLayer上
        if(this.object){
            this.object.moveTo(this.canvas.staticLayer);
            this.canvas.stage!.batchDraw();
        }
        this.start=undefined;
        this.end=undefined;
        this.object=undefined;
    }
    @Bind
    protected onMouseOut(e:Konva.KonvaEventObject<MouseEvent>){
        this.onMouseUp(e);
    }
    
    private drawShape(){
        if(void 0 !== this.object){
            this.updateObject();
        }else{
            this.object=this.getObject();
            this.canvas.brushLayer.add(this.object);
        }
    }
    
}

export {AbsBrush}