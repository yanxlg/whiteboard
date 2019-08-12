/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/9 15:26
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/9 15:26
 * @disc:Abstract Tool
 */

import {Canvas} from '@/Canvas';
import {Config} from '@/Config';
import Konva from 'konva';
import {Bind} from 'lodash-decorators';

export interface ITool {
    destroy():void;
}


abstract class AbsTool<T extends Konva.Shape> implements ITool{
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
    };
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
    protected abstract onMouseMove(e:Konva.KonvaEventObject<MouseEvent>):void;
    @Bind
    protected onMouseUp(e:Konva.KonvaEventObject<MouseEvent>){
        if(this.object){
            this.object.destroy();
            this.canvas.brushLayer.draw();
        }
        this.start=undefined;
        this.end=undefined;
        this.object=undefined;
    }
    @Bind
    protected onMouseOut(e:Konva.KonvaEventObject<MouseEvent>){
        this.onMouseUp(e);
    }
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
}


export {AbsTool}