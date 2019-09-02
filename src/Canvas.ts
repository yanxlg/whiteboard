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
import {Context, decoratorFactory, IConfig} from '@/Context';
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


@decoratorFactory("tool,shapeType")
class Canvas {
    public stage:Konva.Stage;
    public backgroundLayer?:Konva.FastLayer;
    public readonly staticLayer:Konva.Layer;
    public readonly brushLayer:Konva.Layer;
    private readonly context:Context;
    private tool?:IBrush|ITool;
    constructor(container:HTMLDivElement,context:Context,properties:ICanvasSizeProperties) {
        this.context=context;
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
        this.updateTool();
    }
  
    public destroy(){
        console.log("-----------------    destroy context listener -------------------");
        console.log("-----------------    destroy canvas    ---------------------");
    }
    private updateBrush(){
        const {shapeType} = this.context.config;
        this.tool&&this.tool.destroy();
        switch (shapeType) {
            case 'arrow':
                this.tool=new ArrowBrush(this,this.context);
                break;
            case 'circle':
                this.tool=new CircleBrush(this,this.context,false);
                break;
            case 'hollow_circle':
                this.tool=new CircleBrush(this,this.context,true);
                break;
            case 'line':
                this.tool=new LineBrush(this,this.context);
                break;
            case "rect":
                this.tool=new RectBrush(this,this.context,false);
                break;
            case 'hollow_rect':
                this.tool=new RectBrush(this,this.context,true);
                break;
            case "square":
                this.tool=new SquareBrush(this,this.context,false);
                break;
            case 'hollow_square':
                this.tool=new SquareBrush(this,this.context,true);
                break;
            case "ellipse":
                this.tool=new EllipseBrush(this,this.context,false);
                break;
            case 'hollow_ellipse':
                this.tool=new EllipseBrush(this,this.context,true);
                break;
            case "wedge":
                this.tool=new WedgeBrush(this,this.context,false);
                break;
            case 'hollow_wedge':
                this.tool=new WedgeBrush(this,this.context,true);
                break;
            case "star":
                this.tool=new StarBrush(this,this.context,false);
                break;
            case 'hollow_star':
                this.tool=new StarBrush(this,this.context,true);
                break;
            case "ring":
                this.tool=new RingBrush(this,this.context,false);
                break;
            case 'hollow_ring':
                this.tool=new RingBrush(this,this.context,true);
                break;
            case "arc":
                this.tool=new ArcBrush(this,this.context,false);
                break;
            case 'hollow_arc':
                this.tool=new ArcBrush(this,this.context,true);
                break;
            case "polygon":
                this.tool=new RegularPolygonBrush(this,this.context,false);
                break;
            case 'hollow_polygon':
                this.tool=new RegularPolygonBrush(this,this.context,true);
                break;
         
            default:
                break;
        }
    }
    private updateTool(){
        const {tool} = this.context.config;
        this.tool&&this.tool.destroy();
        switch (tool) {
            case 'selection':
                this.tool=new TransFormTool(this,this.context);
                break;
           case 'erase':
                this.tool=new EraseTool(this,this.context);
                break;
            case "text":
                this.tool=new TextBrush(this,this.context);
                break;
            case 'pencil':
                this.tool=new PencilBrush(this,this.context);
                break;
            case 'shape':
                this.updateBrush();
                break;
            default:
                break;
        }
    }
    private onConfigUpdate(attr:string,value:any,config:IConfig){
        if(attr==="shapeType"||attr==="tool"){
            this.updateTool();
        }
    }
}

export {Canvas}