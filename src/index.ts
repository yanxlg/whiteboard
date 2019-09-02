import {Context} from '@/Context';
import "@/less/layout.less";
import {Page} from '@/Page';
import {Bind} from 'lodash-decorators';
import {IDGenerator} from '@/utils/IDGenerator';

class WhiteBoard{
    public readonly context:Context;
    private container!:HTMLDivElement;
    constructor(){
        // 初始值需要计算
        this.context=new Context({
            containerHeight:800,
            containerWidth:600
        });
    }
    @Bind
    public init(container:string|HTMLDivElement){
        const containerEl = typeof container==="string"?document.querySelector(container) as HTMLDivElement:container;
        const box = document.createElement("div");
        box.className="konvajs-box";
        containerEl.appendChild(box);
        this.container=box;
    
    
        this.openNewPage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565778747302&di=ae0e88d0d890a2d733e0edffc3aa3e21&imgtype=0&src=http%3A%2F%2Fimg.redocn.com%2Fsheying%2F20150123%2Fyoumeiruhuadefengjing_3872375.jpg",464,730);
    }
    @Bind
    public openNewPage(image?:string,width?:number,height?:number){
        if(!this.container){
            throw new Error("whiteboard must call init before other api");
        }
        // 打开新页面，计算大小
        const property = width&&height?{imageWidth:width,imageHeight:height}:undefined;
        
        // 需要新增一个tab
        const wbNumber = IDGenerator.getTabId();
        const page = new Page({
            bgImage:image,
            container:this.container,
            context:this.context,
            pageId:wbNumber,
        },property);
        const tab = {
            label:Context.emptyLabel,
            pageInstance:page,
            wbNumber:wbNumber
        };
        this.context.config.tabs.push(tab);
        this.context.config.tabNumber=wbNumber;
    }
}

export {WhiteBoard};