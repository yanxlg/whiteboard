/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/7 9:19
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/7 9:19
 * @disc:TextBrush
 */
import {IBrush} from '@/Brushes/AbsBrush';
import {Canvas} from '@/Canvas';
import {Config} from '@/Config';
import "@/less/ckeditor.less";
import Konva from 'konva';
import {Bind} from 'lodash-decorators';


import html2canvas from "html2canvas";


const BalloonEditor = require("@ckeditor/ckeditor5-build-balloon-block");

// @ts-ignore
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';

// @ts-ignore
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';




class TextBrush implements IBrush{
    public cursor:any;
    public config:Config;
    protected canvas:Canvas;
    private editor?:any;
    private object?:Konva.Image;
    private boundPadding:number=10;
    private labelPadding:number=5;
    private converting:boolean=false;
    private editBoxMinWidth:number=20;
    private editBoxMinHeight:number=20;
    constructor(canvas:Canvas, config:Config){
        this.config=config;
        this.canvas=canvas;
        this.attachEvents();
    }
    public destroy():void{
        this.detachEvents();
        if(this.editor){
            const container = this.editor.editing.view.getDomRoot();
            this.updateObject(container);
        }
    };
    
    protected attachEvents(){
        this.canvas.stage.on("click",this.onClick);
        this.canvas.stage.on("dblclick",this.onDoubleClick);
    }
    
    protected detachEvents(){
        this.canvas.stage.off("click",this.onClick);
        this.canvas.stage.off("dblclick",this.onDoubleClick);
    }
    @Bind
    private updateObject(container:HTMLDivElement){
        this.converting=true;
        if(container.innerText.trim()===""){
            // 没有输入文本
            this.object!.destroy();
            this.editor.destroy();
            this.editor=undefined;
            container.parentElement!.removeChild(container);
            this.object=undefined;
            this.converting=false;
            this.canvas.staticLayer.batchDraw();
            return;
        }
        html2canvas(container,{
            backgroundColor: 'rgba(0,0,0,0)'
        }).then(canvas => {
            this.object!.image(canvas);
            this.object!.visible(true);
            this.object!.setAttrs({
                content: this.editor.getData()
            });
            this.canvas.staticLayer.draw();
            this.editor.destroy();
            this.editor=undefined;
            container.parentElement!.removeChild(container);
            this.object=undefined;
            this.converting=false;
        }).catch(()=>{
            container.parentElement!.removeChild(container);
            this.editor.destroy();
            this.editor=undefined;
            this.object=undefined;
            this.converting=false;
        });
    }
    @Bind
    private onClick(e:Konva.KonvaEventObject<MouseEvent>){
        const detail = e.evt.detail;
        if(detail===1&&void 0 !==this.editor&&void 0 !== this.object&&!this.converting){
            const target = e.evt.target;
            const container = this.editor.editing.view.getDomRoot();
            if(container.contains(target)){
                return;
            }
            this.updateObject(container);
        }
    }
    @Bind
    private onDoubleClick(e:Konva.KonvaEventObject<MouseEvent>){
        if(this.converting){return}
        const target = e.target;
        const div = document.createElement("div");
        div.className="wb-ckeditor";
        div.style.minWidth=`${this.editBoxMinWidth}px`;// 根据字体大小计算
        div.style.minHeight=`${this.editBoxMinHeight}px`;// 根据字体大小计算
        div.style.padding=`${this.labelPadding}px`;
        const containerRect = this.canvas.stage.getContent().getBoundingClientRect()
        if(target&&target instanceof Konva.Image){
            // 重新计算
            const position={
                x:target.x(),
                y:target.y()
            };
            div.style.maxWidth=`${this.canvas.stage.width()-position.x-this.boundPadding}px`;// 计算长度
            div.style.maxHeight=`${this.canvas.stage.height()-position.y-this.boundPadding}px`;
            div.style.left=`${position.x+containerRect.left}px`;
            div.style.top=`${position.y+containerRect.top}px`;
            div.innerHTML=target.attrs.content;
            this.object=target;
        }else{
            const pointerPosition = this.canvas.stage.getPointerPosition();
            // 创建一个div元素，然后创建编辑器
            div.style.maxWidth=`${this.canvas.stage.width()-pointerPosition.x-this.boundPadding}px`;// 计算长度
            div.style.maxHeight=`${this.canvas.stage.height()-pointerPosition.y-this.boundPadding}px`;
            div.style.left=`${pointerPosition.x+containerRect.left-this.labelPadding}px`;
            div.style.top=`${pointerPosition.y+containerRect.top-this.labelPadding}px`;
            this.object = new Konva.Image({
                image:null,
                x: pointerPosition.x-this.labelPadding,
                y: pointerPosition.y-this.labelPadding
            });
        }
        document.body.appendChild(div);
        BalloonEditor.create(div,{
            blockToolbar:[],
            extraPlugins: [FontColor,FontSize],
            removePlugins:["Link","ImageUpload","ImageTextAlternative","ImageTextAlternative","BlockQuote","Ckfinder","Heading","ImageStyle:full","ImageStyle:side","List","MediaEmbed","Table"],
            toolbar: ['bold', 'italic','fontColor',"fontSize"],
        }).then((editor:any)=>{
            if(this.object!.image()){
                this.object!.visible(false);
                this.canvas.staticLayer.batchDraw();
            }
            this.editor=editor;
            setTimeout(()=>{
                editor.editing.view.focus();
            },0);
        })
        .catch( (error:any) => {
            console.error( error );
        });
        this.canvas.staticLayer.add(this.object);
    }
}

export {TextBrush}