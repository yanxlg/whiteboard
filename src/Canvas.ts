/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/5 9:52
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/5 9:52
 * @disc:Canvas
 * Canvas contains two layers,one is static layer,one is animation layer.static layer draw static shapes,animation layer draw brush or animation process.
 *
 * free draw use native context to draw to enhancing User Experience.other shapes even if you use native context,you still need to call clear API then redraw,so ite is not necessary to use native context.
 *
 * after image loaded,calc image size,send message with image size
 */
import {IBrush} from '@/Brushes/AbsBrush';
import {ArcBrush} from '@/Brushes/ArcBrush';
import {ArrowBrush} from '@/Brushes/ArrowBrush';
import {CircleBrush} from '@/Brushes/CircleBrush';
import {EllipseBrush} from '@/Brushes/EllipseBrush';
import {LineBrush} from '@/Brushes/LineBrush';
import {PencilBrush} from '@/Brushes/PencilBrush';
import {RectBrush} from '@/Brushes/RectBrush';
import {RegularPolygonBrush} from '@/Brushes/RegularPolygonBrush';
import {RingBrush} from '@/Brushes/RingBrush';
import {SquareBrush} from '@/Brushes/SquareBrush';
import {StarBrush} from '@/Brushes/StarBrush';
import {TextBrush} from '@/Brushes/TextBrush';
import {WedgeBrush} from '@/Brushes/WedgeBrush';
import {Config,IConfig} from '@/Config';
import {ITool} from '@/Tools/AbsTool';
import {EraseTool} from '@/Tools/EraseTool';
import {TransFormTool} from '@/Tools/TransformTool';
import Konva from "konva";



export declare interface ICanvasSizeProperties{
    bgImage?:HTMLImageElement;
    bgSize?:{
        height:number,
        scaleX:number,
        scaleY:number,
        width:number,
        x:number,
        y:number,
    };
    contentHeight:number;
    contentWidth:number;
}



// @ts-ignore
Konva.hitOnDragEnabled = true;

class Canvas {
    public stage?:Konva.Stage;
    public backgroundLayer?:Konva.FastLayer;
    public readonly staticLayer:Konva.Layer;
    public readonly brushLayer:Konva.Layer;
    private readonly config:Config;
    private brush?:IBrush;
    private tool?:ITool;
    constructor(container:HTMLDivElement,config:Config,properties:ICanvasSizeProperties) {
        this.config=config;
        this.stage=new Konva.Stage({
            container:container,
            height:properties.contentHeight,
            width:properties.contentWidth
        });
        this.staticLayer=new Konva.Layer();
        this.brushLayer=new Konva.Layer();
        
        const {bgImage,bgSize} = properties;
        if(bgImage){
            this.backgroundLayer=new Konva.FastLayer();
            this.stage.add(this.backgroundLayer);
            if(bgImage.complete){
                const bg = new Konva.Image({
                    image:bgImage,
                    ...bgSize
                });
                this.backgroundLayer!.add(bg);
                this.backgroundLayer!.batchDraw();
            }else{
                bgImage.addEventListener("load",()=>{
                    const bg = new Konva.Image({
                        image:bgImage,
                        ...bgSize
                    });
                    this.backgroundLayer!.add(bg);
                    this.backgroundLayer!.batchDraw();
                })
            }
        }
    
        this.stage.add(this.staticLayer).add(this.brushLayer);
        this.config.listener(this.onConfigUpdate);
        this.updateBrush();
        this.updateTool();
    
        const circle=new Konva.Circle({
            fill:"red",
            radius:50,
            x: 50,
            y: 50
        });
        this.staticLayer.add(circle);
        this.stage.draw();
    }
    public updateProperties(properties:ICanvasSizeProperties){
        // update
    }
    public destroy(){
        this.config.offListener(this.onConfigUpdate);
    }
    private updateBrush(){
        const {brush} = this.config;
        this.brush&&this.brush.destroy();
        switch (brush) {
            case 'arrow':
                this.brush=new ArrowBrush(this,this.config);
                break;
            case 'circle':
                this.brush=new CircleBrush(this,this.config);
                break;
            case 'line':
                this.brush=new LineBrush(this,this.config);
                break;
            case "rect":
                this.brush=new RectBrush(this,this.config);
                break;
            case "square":
                this.brush=new SquareBrush(this,this.config);
                break;
            case "ellipse":
                this.brush=new EllipseBrush(this,this.config);
                break;
            case "wedge":
                this.brush=new WedgeBrush(this,this.config);
                break;
            case "star":
                this.brush=new StarBrush(this,this.config);
                break;
            case "ring":
                this.brush=new RingBrush(this,this.config);
                break;
            case "arc":
                this.brush=new ArcBrush(this,this.config);
                break;
            case "polygon":
                this.brush=new RegularPolygonBrush(this,this.config);
                break;
            case "text":
                this.brush=new TextBrush(this,this.config);
                break;
            case 'pencil':
                this.brush=new PencilBrush(this,this.config);
                break;
            default:
                break;
        }
    }
    private updateTool(){
        const {tool} = this.config;
        this.tool&&this.tool.destroy();
        switch (tool) {
            case 'transform':
                this.tool=new TransFormTool(this,this.config);
               break;
               case 'erase':
                   this.tool=new EraseTool(this,this.config);
            default:
                break;
        }
    }
    private onConfigUpdate(prevConfig:IConfig,nextConfig:IConfig){
        (prevConfig.brush!==nextConfig.brush)&&this.updateBrush();
        (prevConfig.tool!==nextConfig.tool)&&this.updateTool();
    }
}

export {Canvas}