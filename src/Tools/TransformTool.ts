/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/9 15:15
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/9 15:15
 * @disc:TransformTool
 * support multiSelection
 *
 * all shapes support drag
 */
import {Canvas} from '@/Canvas';
import {Config} from '@/Config';
import {AbsTool} from '@/Tools/AbsTool';
import Konva from 'konva';
import {IRect} from 'konva/types/types';
import {Bind} from 'lodash-decorators';

class TransFormTool extends AbsTool<Konva.Rect>{
    private transformer?:Konva.Transformer=undefined;
    private group?:Konva.Group=undefined;
    private target?:Konva.Shape|Konva.Stage;
    constructor(canvas:Canvas, config:Config){
        super(canvas,config);
        this.canvas.staticLayer.draw();
        // allow draggable
        this.canvas.staticLayer.children.toArray().forEach((shape)=>{
           shape.draggable(true);
        });
    }
    @Bind
    public destroy(){
        super.destroy();
        if(this.transformer){
            this.transformer.destroy();
            this.transformer=undefined;
            this.canvas.brushLayer.batchDraw();
        }
        if(this.group){
            this.releaseGroup();
        }
        this.canvas.staticLayer.children.toArray().forEach((shape)=>{
            shape.draggable(false);
        });
    }
    @Bind
    protected attachEvents() {
        super.attachEvents();
        this.canvas.stage.on('click tap', this.onShapeClick);
    }
    @Bind
    protected detachEvents() {
        super.detachEvents();
        this.canvas.stage.off('click tap', this.onShapeClick);
    }
    
    @Bind
    protected onShapeClick(e: Konva.KonvaEventObject<MouseEvent>){
        if (e.target === this.canvas.stage) {
            return;
        }
        // do nothing if clicked NOT on our rectangles
        e.target.draggable(true);
        e.target.moveTo(this.canvas.brushLayer);
        const {transformerAnchorStroke,transformerAnchorWidth,transformerBorderStroke,transformerBorderWidth} = this.config;
        !this.transformer&&(this.transformer=new Konva.Transformer({
            anchorStroke:transformerAnchorStroke,
            anchorStrokeWidth:transformerAnchorWidth,
            borderStroke:transformerBorderStroke,
            borderStrokeWidth:transformerBorderWidth,
        }));
        this.canvas.brushLayer.add(this.transformer as any);
        this.transformer.attachTo(e.target);
        this.transformer.forceUpdate();
        this.canvas.stage.draw();
    }
    
    @Bind
    protected onMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
        if(e.target!==this.canvas.stage){
            return;
        }
        this.target=e.target;
        super.onMouseDown(e);
        // destroy transformer
        if(this.transformer){
            this.transformer.destroy();
            this.transformer=undefined;
            this.canvas.brushLayer.batchDraw();
        }
        if(this.group){
            this.releaseGroup();
        }
    }
    @Bind
    protected onMouseMove(e: Konva.KonvaEventObject<MouseEvent>): void {
        if(this.target!==this.canvas.stage){
            return;
        }
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
            this.group = new Konva.Group({
                draggable:true
            });
            this.canvas.staticLayer.children.toArray().forEach((shape)=>{
                if (this.haveIntersection(containerRect,shape.getClientRect(null))) {
                    const clone = shape.clone();
                    clone.draggable(false);// single element not allow drag
                    shape.destroy();
                    this.group!.add(clone);
                }
            });
            this.canvas.brushLayer.children.toArray().forEach((shape)=>{
                // except this.object
                if (shape!==this.object&&this.haveIntersection(containerRect,shape.getClientRect(null))) {
                    const clone = shape.clone();
                    clone.draggable(false);// single element not allow drag
                    shape.destroy();
                    this.group!.add(clone);
                }
            });
            if(this.group.children.length>0){
                this.canvas.brushLayer.add(this.group);
                const {transformerAnchorStroke,transformerAnchorWidth,transformerBorderStroke,transformerBorderWidth} = this.config;
                !this.transformer&&(this.transformer=new Konva.Transformer({
                    anchorStroke:transformerAnchorStroke,
                    anchorStrokeWidth:transformerAnchorWidth,
                    borderStroke:transformerBorderStroke,
                    borderStrokeWidth:transformerBorderWidth,
                }));
                this.canvas.brushLayer.add(this.transformer as any);
                this.transformer.attachTo(this.group);
                this.transformer.forceUpdate();
            }else{
                this.group!.destroy();
                this.transformer&&this.transformer!.destroy();
                this.transformer=undefined;
            }
            this.object.destroy();
            this.canvas.stage.draw();
        }
        this.start=undefined;
        this.end=undefined;
        this.object=undefined;
        this.target=undefined;
    }
    @Bind
    private releaseGroup(){
        this.group!.children.toArray().forEach((shape)=>{
            const matrix = shape.getAbsoluteTransform().getMatrix();
            const attrs = this.decompose(matrix);
            shape.moveTo(this.canvas.staticLayer);
            shape.setAttrs(attrs);
            shape.draggable(true);
        });
        this.group!.destroy();
        this.group=undefined;
        this.canvas.stage.draw();
    }
    @Bind
    private decompose(matrix:number[]) {
        const [a,b,c,d,e,f] = matrix;
        const delta = a * d - b * c;
        const result = {
            rotation: 0,
            scaleX: 0,
            scaleY: 0,
            skewX: 0,
            skewY: 0,
            x: e,
            y: f,
        };
        
        // Apply the QR-like decomposition.
        if (a !== 0 || b !== 0) {
            const r = Math.sqrt(a * a + b * b);
            result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
            result.scaleX = r;
            result.scaleY = delta / r;
            result.skewX = Math.atan((a * c + b * d) / (r * r));
            result.skewY = 0;
        } else if (c !== 0 || d !== 0) {
            const s = Math.sqrt(c * c + d * d);
            result.rotation =
                Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
            result.scaleX = delta / s
            result.scaleY = s;
            result.skewX = 0;
            result.skewY = Math.atan((a * c + b * d) / (s * s));
        } else {
            // a = b = c = d = 0
        }
        result.rotation *= 180 / Math.PI;
        return result;
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
