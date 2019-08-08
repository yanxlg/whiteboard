/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/5 9:52
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/5 9:52
 * @disc:Canvas
 * Canvas contains two layers,one is static layer,one is animation layer.static layer draw static shapes,animation layer draw brush or animation process.
 *
 * free draw use native context to draw to enhancing User Experience.other shapes even if you use native context,you still need to call clear API then redraw,so ite is not necessary to use native context.
 */
import {AbsBrush} from '@/Brushes/AbsBrush';
import {ArrowBrush} from '@/Brushes/ArrowBrush';
import {CircleBrush} from '@/Brushes/CircleBrush';
import {LineBrush} from '@/Brushes/LineBrush';
import {RectBrush} from '@/Brushes/RectBrush';
import {Config,IConfig} from '@/Config';
import Konva from "konva";
import {SquareBrush} from '@/Brushes/SquareBrush';
import {EllipseBrush} from '@/Brushes/EllipseBrush';
import {WedgeBrush} from '@/Brushes/WedgeBrush';
import {StarBrush} from '@/Brushes/StarBrush';
import {RingBrush} from '@/Brushes/RingBrush';
import {ArcBrush} from '@/Brushes/ArcBrush';
import {RegularPolygonBrush} from '@/Brushes/RegularPolygonBrush';
import {TextBrush} from '@/Brushes/TextBrush';

class Canvas {
    public readonly stage:Konva.Stage;
    public readonly staticLayer:Konva.Layer;
    public readonly brushLayer:Konva.Layer;
    private readonly config:Config;
    private brush?:AbsBrush<Konva.Shape>;
    constructor({container,width,height}:{container:string|HTMLDivElement;width:number;height:number},config:Config) {
        this.config=config;
        this.stage=new Konva.Stage({
            container,
            height,
            width
        });
        this.staticLayer=new Konva.Layer();
        this.brushLayer=new Konva.Layer();
        this.stage.add(this.staticLayer);
        this.stage.add(this.brushLayer);
    
        this.config.listener(this.onConfigUpdate);
        
        
        this.updateBrush();
        
        
        
    /*
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    
    
        // then we are going to draw into special canvas element
        const canvas = document.createElement('canvas');
        canvas.width = this.stage.width();
        canvas.height = this.stage.height();
    
        // created canvas we can add to layer as "Konva.Image" element
        const image = new Konva.Image({
            image: canvas,
            x: 0,
            y: 0
        });
        this.brushLayer.add(image);
 
        this.stage.draw();
    
        // Good. Now we need to get access to context element
        const context = canvas.getContext('2d');
        context!.strokeStyle = '#df4b26';
        context!.lineJoin = 'round';
        context!.lineWidth = 5;
    
        // 不够平滑过渡
        
        let isPaint = false;
        let lastPointerPosition:any;
        const mode = 'brush';
    
        // now we need to bind some events
        // we need to start drawing on mousedown
        // and stop drawing on mouseup
        image.on('mousedown touchstart', ()=>{
            isPaint = true;
            lastPointerPosition = this.stage.getPointerPosition();
        });
    
        // will it be better to listen move/end events on the window?
    
        this.stage.on('mouseup touchend', ()=>{
            isPaint = false;
        });
    
        // and core function - drawing
        this.stage.on('mousemove touchmove', ()=>{
            if (!isPaint) {
                return;
            }
        
            if (mode === 'brush') {
                context!.globalCompositeOperation = 'source-over';
            }
            context!.beginPath();
        
            let localPos = {
                x: lastPointerPosition.x - image.x(),
                y: lastPointerPosition.y - image.y()
            };
            context!.moveTo(localPos.x, localPos.y);
            const pos = this.stage.getPointerPosition();
            localPos = {
                x: pos.x - image.x(),
                y: pos.y - image.y()
            };
            context!.lineTo(localPos.x, localPos.y);
            context!.closePath();
            context!.stroke();
            lastPointerPosition = pos;
            this.brushLayer.batchDraw();
        });*/
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
                break;
            default:
                break;
        }
    }
    private onConfigUpdate(prevConfig:IConfig,nextConfig:IConfig){
        (prevConfig.brush!==nextConfig.brush)&&this.updateBrush();
        
        
        
        
    }
}

export {Canvas}