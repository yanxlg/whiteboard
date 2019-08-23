/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/13 17:31
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/13 17:31
 * @disc:Page
 * support image or canvas
 */
import {Canvas, ICanvasSizeProperties} from '@/Canvas';
import {Config} from '@/Config';
import {Bind} from 'lodash-decorators';

export interface IPage {
    pageId:number|string;
    pageNo?:number;// 支持多页管理
    bgImage?:string;
    config:Config;
    container:HTMLDivElement;
}

export interface IPageSizeProperties {
    imageHeight:number;
    imageWidth:number;
}

class Page {
    private pageId:number|string;
    private pageNo?:number;
    private bgImage?:string;
    private config:Config;
    private container:HTMLDivElement;
    private canvas?:Canvas;
    constructor(props:IPage,sizeProperty?:IPageSizeProperties){
        this.pageId=props.pageId;
        this.pageNo=props.pageNo;
        this.bgImage=props.bgImage;
        this.config=props.config;
        this.container=props.container;
        if(void 0 !==sizeProperty){
            const properties = this.getCanvasProperties(sizeProperty.imageWidth,sizeProperty.imageHeight);
            const image = new Image();
            image.src=this.bgImage!;
            this.canvas=new Canvas(this.container,this.config,Object.assign({
                ...properties,
                bgImage:image
            }));
        }else{
            this.getCanvasSize(this.bgImage).then((properties:ICanvasSizeProperties)=>{
                this.canvas=new Canvas(this.container,this.config,properties);
            },()=>{
                // 加载异常
                alert("loadingerror 重试");
                
            });
        }
    }
    private getCanvasProperties(width:number,height:number){
        const imageRatio = height/width;
        const originWidth = this.config.containerWidth;
        const originHeight = this.config.containerHeight;
        if(originHeight/originWidth<imageRatio){
            const nextHeight = originWidth*imageRatio;
            return {
                bgSize:{
                    height:height,
                    scaleX:originWidth/width,
                    scaleY:originWidth/width,
                    width:width,
                    x:0,
                    y:0,
                },
                contentHeight:nextHeight,
                contentWidth:originWidth,
            };
        }else{
            // 背景图位置
            // calc 图片大小
            let imageH=0;
            let imageW=0;
            const xRatio = originWidth / width;
            const yRatio = originHeight / height;
            if(xRatio > yRatio){
                imageH=originHeight;
                imageW=originHeight*width/height;
            }else{
                imageW=originWidth;
                imageH=originWidth*height/width;
            }
            return {
                bgSize:{
                    height:height,
                    scaleX:imageW/width,
                    scaleY:imageW/width,
                    width:width,
                    x:(originWidth - imageW) / 2,
                    y:(originHeight - imageH) / 2
                },
                contentHeight:originHeight,
                contentWidth:originWidth,
            };
        }
    }
    @Bind
    private getCanvasSize(imagePath?:string):Promise<ICanvasSizeProperties>{
        return new Promise((resolve,reject)=>{
            if(imagePath){
                const image = new Image();
                let tryTimes=0;
                image.onload=()=>{
                    // 根据container width 和height计算相应的区域
                    const width = image.width;
                    const height = image.height;
                    resolve({
                        bgImage:image,
                        ...this.getCanvasProperties(width,height)
                    });
                };
                image.onerror=()=>{
                    // try again
                    if(tryTimes>=3){
                        reject();// 可能需要创建默认画布，将后续消息暂时绘制上
                        return;
                    }
                    tryTimes++;
                    setTimeout(()=>{
                        console.log("try load bgImage again...");
                        image.src=imagePath!;
                    },10);
                };
                image.src=imagePath;
            }else{
                const originWidth = this.config.containerWidth;
                const originHeight = this.config.containerHeight;
                resolve({
                    contentHeight:originHeight,
                    contentWidth:originWidth,
                });
            }
        })
    }
}

export {Page}