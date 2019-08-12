/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/9 15:15
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/9 15:15
 * @disc:TransformTool
 * support multiSelection
 */
import {AbsTool} from '@/Tools/AbsTool';
import Konva from 'konva';
import {Bind} from 'lodash-decorators';
import {IRect} from 'konva/types/types';
import {Canvas} from '@/Canvas';
import {Config} from '@/Config';
import {shape} from "prop-types";

class TransFormTool extends AbsTool<Konva.Rect>{
    private transformer:Konva.Transformer;
    constructor(canvas:Canvas, config:Config){
        super(canvas,config);
        for (let i=0;i<10;i++){
            const shape = new Konva.Rect({
                fill: 'grey',
                height: 30 + Math.random() * 30,
                name: 'fillShape',
                rotation: 360 * Math.random(),
                width: 30 + Math.random() * 30,
                x:100+Math.random()*400,
                y:100+Math.random()*400,
            });
            this.canvas.staticLayer.add(shape);
        }
        this.canvas.staticLayer.draw();
    }
    @Bind
    protected onMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
        super.onMouseDown(e);
        // if(this.transformer){
        //     this.transformer.destroy();
        //     this.canvas.brushLayer.draw();
        // }
    }
    @Bind
    protected onMouseMove(e: Konva.KonvaEventObject<MouseEvent>): void {
        if(this.object){
            this.object!.width(this.end!.x-this.start!.x);
            this.object!.height(this.end!.y-this.start!.y);
            this.canvas.brushLayer.draw();
        }else{
            const {selectionColor,selectionBorderColor,selectionBorderWidth} = this.config;
            this.object=new Konva.Rect({
                fill:selectionColor,
                height:this.end!.y-this.start!.y,
                stroke:selectionBorderColor,
                strokeWidth:selectionBorderWidth,
                width:this.end!.x-this.start!.x,
                x: this.start!.x,
                y: this.start!.y,
            });
            this.canvas.brushLayer.add(this.object);
            this.canvas.brushLayer.draw();
        }
    }
    @Bind
    protected onMouseUp(e: Konva.KonvaEventObject<MouseEvent>) {
        if(this.object){
            const containerRect = this.object.getClientRect(null);
            const group = new Konva.Group();
            this.canvas.staticLayer.children.each((shape)=>{
                if (this.haveIntersection(containerRect,shape.getClientRect(null))) {
                    const clone = shape.clone();
                    shape.destroy();// 从staticLayer移除
                    // group
                    group.add(clone);
                }
            });
            group.on("transformend",()=>{
                const clone = group.clone();
                this.canvas.staticLayer.add(clone);
                group.destroy();
                console.log(group.toObject());
               /*   group.children.each((shape)=>{


                      const clone = shape.clone();
                      const actualRect = shape.getClientRect({
                          relativeTo:this.canvas.brushLayer
                      });
                      clone .x(actualRect.x);
                      clone .y(actualRect.y);
                      clone .width(actualRect.width);
                      clone .height(actualRect.height);
                      shape.destroy();
                      console.log(shape.toJSON());
                      this.canvas.staticLayer.add(clone);
                      // shape.moveTo(this.canvas.brushLayer);
                      console.log(shape.getClientRect({
                          relativeTo:this.canvas.brushLayer
                      }))
                      /!*


                      console.log(shape.getAbsoluteTransform());
                      console.log(shape.getAbsoluteScale());
                      const clone = shape.clone();
                      shape.destroy();// 从staticLayer移除
                      this.canvas.staticLayer.add(clone);
                      console.log(clone.getClientRect({
                          skipTransform:false,
                          skipStroke:false,
                      }));*!/
                  });*/
                  this.canvas.stage.draw();
            });
            // 下一次需要还原回底层
            this.canvas.brushLayer.add(group);
            !this.transformer&&(this.transformer=new Konva.Transformer());
            this.canvas.brushLayer.add(this.transformer);
            this.transformer.attachTo(group);
            this.object.destroy();
            this.canvas.stage.draw();
        }
        this.start=undefined;
        this.end=undefined;
        this.object=undefined;
        // 获取范围内所有元素
    }
    @Bind
    private haveIntersection(container:IRect, element:IRect){
        return !(
            element.x+element.width > container.x + container.width ||
            element.x < container.x ||
            element.y + element.height > container.y + container.height ||
            element.y < container.y
        );
    }
}

export {TransFormTool}
