/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/6 14:01
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/6 14:01
 * @disc:EllipseBrush
 */
import {AbsBrush} from '@/Brushes/AbsBrush';
import Konva from 'konva';
import {Bind} from 'lodash-decorators';

class EllipseBrush extends AbsBrush<Konva.Ellipse>{
    private _shiftKey:boolean=false;
    protected get shiftKey(): boolean {
        return this._shiftKey;
    }
    protected set shiftKey(value: boolean) {
        if(this._shiftKey!==value){
            this._shiftKey = value;
            if(this.object){
                this.updateObject();
            }
        }
    }
    
    protected getObject(): Konva.Ellipse {
        const {x,y} = this.start!;
        let width = this.end!.x-x;
        let height = this.end!.y-y;
        const {fill,stroke,strokeWidth} = this.config;
    
        if(this.shiftKey){
            // square
            const absWidth = Math.abs(width);
            const absHeight = Math.abs(height);
            if(absWidth>absHeight){
                width=width>0?absHeight:-absHeight;
            }else{
                height=height>0?absWidth:-absWidth;
            }
        }
    
        return new Konva.Ellipse({
            fill: fill,
            radiusX: Math.abs(width)/2,
            radiusY: Math.abs(height)/2,
            stroke: stroke,
            strokeWidth: strokeWidth,
            x:x+width/2,
            y: y+height/2,
        });
    }
    
    protected updateObject(): void {
        const {x,y} = this.start!;
        let width = this.end!.x-x;
        let height = this.end!.y-y;
    
        if(this.shiftKey){
            // square
            const absWidth = Math.abs(width);
            const absHeight = Math.abs(height);
            if(absWidth>absHeight){
                width=width>0?absHeight:-absHeight;
            }else{
                height=height>0?absWidth:-absWidth;
            }
        }
        
        this.object!.radiusX(Math.abs(width)/2);
        this.object!.radiusY(Math.abs(height)/2);
        this.object!.x(x+width/2);
        this.object!.y(y+height/2);
        this.canvas.brushLayer.draw();
    }
    
    protected attachEvents(){
        super.attachEvents();
        document.addEventListener("keydown",this.onKeyDown);
        document.addEventListener("keyup",this.onKeyUp);
    }
    protected detachEvents(){
        super.detachEvents();
        document.removeEventListener("keydown",this.onKeyDown);
        document.removeEventListener("keyup",this.onKeyUp);
    }
    
    @Bind
    private onKeyDown(ev:KeyboardEvent){
        const {key,keyCode} = ev;
        if(key==="Shift"||keyCode===16){
            this.shiftKey=true;
        }
    }
    @Bind
    private onKeyUp(ev:KeyboardEvent){
        const {key,keyCode} = ev;
        if(key==="Shift"||keyCode===16){
            this.shiftKey=false;
        }
    }
}

export {EllipseBrush}