import {Context} from '@/Context';
import "@/less/layout.less";
import {Page} from '@/Page';
import {IDGenerator} from '@/utils/IDGenerator';
import {Bind} from 'lodash-decorators';

class WhiteBoard{
    public readonly context:Context;
    private container!:HTMLDivElement;
    constructor(){
        // 初始值需要计算
        this.context=new Context({
            containerHeight:0,
            containerWidth:0
        });
    }
    @Bind
    public init(container:string|HTMLDivElement){
        const containerEl = typeof container==="string"?document.querySelector(container) as HTMLDivElement:container;
        const box = document.createElement("div");
        box.className="konvajs-box";
        box.style.backgroundColor=Context.containerBg;
        containerEl.appendChild(box);
        this.container=box;
        const size = this.calcSize(containerEl);
        this.context.config.containerHeight=size.height;// 初始化大小
        this.context.config.containerWidth=size.width;// 初始化大小
        
        this.openNewPage({
            image:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565778747302&di=ae0e88d0d890a2d733e0edffc3aa3e21&imgtype=0&src=http%3A%2F%2Fimg.redocn.com%2Fsheying%2F20150123%2Fyoumeiruhuadefengjing_3872375.jpg"
        });
    }
    @Bind
    public openNewPage({image,width,height,label}:{
        image?:string;
        width?:number;
        height?:number;
        label?:string
    }={}){
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
            label:label||Context.emptyLabel,
            pageInstance:page,
            wbNumber:wbNumber
        };
        this.context.config.tabs.push(tab);
        this.context.config.tabNumber=wbNumber;
    }
    
    /**
     * 重新打开
     * @param wbNumber
     */
    @Bind
    public reOpenPage(wbNumber:string){
        const active = this.context.config.tabNumber;
        
        // 内存依旧占用，不会释放
        if(wbNumber===active||!wbNumber){
            return;
        }
        const oldPage = this.context.config.tabs.find(tab=>tab.wbNumber===wbNumber)!.pageInstance;
        const page = new Page({
            bgImage:oldPage!.bgImage,
            container:this.container,
            context:this.context,
            pageId:wbNumber,
        });
        this.context.config.tabs.find(tab=>tab.wbNumber===wbNumber)!.pageInstance=page;
    }
    
    
    
    public updateSize(){
    
    }
    
    @Bind
    private calcSize(container:HTMLDivElement){
        const {offsetWidth:width,offsetHeight:height} = container;
        const ratio = Context.offsetRatio;
        let w:number;
        let h:number;
        if(width/height>ratio){
            w = height * ratio;
            h = height;
        }else{
            w = width;
            h = width / ratio;
        }
        return {
            height:h,
            width:w
        };
    }
}

export {WhiteBoard};