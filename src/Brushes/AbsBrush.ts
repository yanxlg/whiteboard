/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/5 15:47
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/5 15:47
 * @disc:IBrush
 */
import {Canvas} from '@/Canvas';
import {Config} from '@/Config';
import Konva from 'konva';
import {Bind} from 'lodash-decorators';

export interface IBrush{
    destroy():void;
}



abstract class AbsBrush<T extends Konva.Shape> implements IBrush{
    public cursor:any;
    public config:Config;
    protected canvas:Canvas;
    protected object?:T;
    protected start?:Konva.Vector2d;
    protected end?:Konva.Vector2d;
    
    constructor(canvas:Canvas, config:Config){
        this.config=config;
        this.canvas=canvas;
        this.attachEvents();
    }
    public destroy():void{
        this.detachEvents();
        this.object=undefined;
        this.start=undefined;
        this.end=undefined;
    };
    protected abstract updateObject():void;
    protected abstract getObject():T;
    protected attachEvents(){
        this.canvas.stage.on(this.config.mouseDownEvents,this.onMouseDown);
        this.canvas.stage.on(this.config.mouseMoveEvents,this.onLayerMouseMove);
        this.canvas.stage.on(this.config.mouseUpEvents,this.onMouseUp);
        this.canvas.stage.on(this.config.mouseOutEvents,this.onMouseOut);
    }
    
    protected detachEvents(){
        this.canvas.stage.off(this.config.mouseDownEvents,this.onMouseDown);
        this.canvas.stage.off(this.config.mouseMoveEvents,this.onLayerMouseMove);
        this.canvas.stage.off(this.config.mouseUpEvents,this.onMouseUp);
        this.canvas.stage.off(this.config.mouseOutEvents,this.onMouseOut);
    }
    
    @Bind
    protected onMouseDown(e:Konva.KonvaEventObject<MouseEvent>){
        this.start = this.canvas.stage.getPointerPosition();
    }
    @Bind
    protected onLayerMouseMove(e:Konva.KonvaEventObject<MouseEvent>){
        if(this.start){
            this.end = this.canvas.stage.getPointerPosition();
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
            this.canvas.stage.batchDraw();
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