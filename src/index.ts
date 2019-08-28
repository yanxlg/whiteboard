import {Context} from '@/Context';
import "@/less/layout.less";
import {Page} from '@/Page';

class WhiteBoard{
    public readonly context:Context;
    private container:HTMLDivElement;
    constructor(container:string|HTMLDivElement){
        const containerEl = typeof container==="string"?document.querySelector(container) as HTMLDivElement:container;
        const box = document.createElement("div");
        box.className="konvajs-box";
        containerEl.appendChild(box);
        this.container=box;
        // 初始值需要计算
        this.context=new Context({
            containerHeight:800,
            containerWidth:600
        });
        
        this.openNewPage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565778747302&di=ae0e88d0d890a2d733e0edffc3aa3e21&imgtype=0&src=http%3A%2F%2Fimg.redocn.com%2Fsheying%2F20150123%2Fyoumeiruhuadefengjing_3872375.jpg",464,730);
    }
    public openNewPage(image?:string,width?:number,height?:number){
        // 打开新页面，计算大小
        const property = width&&height?{imageWidth:width,imageHeight:height}:undefined;
        // 抛出消息  throw
        new Page({
            bgImage:image,
            container:this.container,
            context:this.context,
            pageId:"dsadsa",
        },property);
    }
}

export {WhiteBoard};