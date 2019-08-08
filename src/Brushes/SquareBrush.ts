/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/6 13:55
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/6 13:55
 * @disc:SquareBrush
 */
import {AbsBrush} from '@/Brushes/AbsBrush';
import Konva from 'konva';

class SquareBrush extends AbsBrush<Konva.Rect>{
    private _shiftKey:boolean=true;
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
    protected getObject(): Konva.Rect {
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
        
        return new Konva.Rect({
            fill,
            height,
            stroke,
            strokeWidth,
            width,
            x: x,
            y: y,
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
        
        this.object!.width(width);
        this.object!.height(height);
        this.canvas.brushLayer.draw();
    }
}

export {SquareBrush};