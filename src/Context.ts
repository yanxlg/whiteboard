/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/5 13:53
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/5 13:53
 * @disc:Config 配置
 */
import {ITabBarItem} from '@/TabBar';
import {INNER_TOOLBAR_ITEM_LIST, IToolbarItem} from '@/Toolbar';
import {Bind} from 'lodash-decorators';


export declare interface IConfig {
    containerWidth:number;
    containerHeight:number;
    fill?:string;
    stroke:string;
    strokeWidth:number;
    selectionColor:string;
    selectionBorderColor:string;
    selectionBorderWidth:number;
    transformerBorderStroke:string;
    transformerBorderWidth:number;
    transformerAnchorStroke:string;
    transformerAnchorWidth:number;
    eraseSize:number;
    brush?:"pencil"|"arrow"|"line"|"circle"|"rect"|"square"|"ellipse"|"wedge"|"star"|"ring"|"arc"|"polygon"|"text"|"pencil";
    tool?:"transform"|"erase";
}




export interface IConfigProps {
    containerWidth:number;
    containerHeight:number;
}


// class decorator
export function decoratorFactory(attrs: string | string[]):any{
    const attrList = typeof attrs==="string"?attrs.split(","):attrs;
    return (target:any)=>{
        // 继承原有实例
        const _target = function() {
            // @ts-ignore
            target.apply(this,Array.prototype.slice.call(arguments,0));
            // @ts-ignore
            const self:any=this;
            
            if(self.onConfigUpdate){
                const context = self.props&&self.props.context||self.context;
                if(context instanceof Context){
                    const listenerList:Map<string,any>=new Map();
                    // 绑定事件
                    attrList.map((attr)=>{
                        const listener = self.onConfigUpdate.bind(self);
                        listenerList.set(attr,listener);
                        // @ts-ignore
                        context.addListener(attr,listener);
                    });
                    if(self.componentWillUnmount){
                        const _willMount=self.componentWillUnmount;
                        self.componentWillUnmount=()=>{
                            // clear listener
                            listenerList.forEach((listener,attr)=>{
                                // @ts-ignore
                                context.removeListener(attr,listener);
                            });
                            _willMount.call(self);
                        };
                    }else if(self.destroy){
                        const _destroy=self.destroy;
                        self.destroy=()=>{
                            // clear listener
                            listenerList.forEach((listener,attr)=>{
                                // @ts-ignore
                                context.removeListener(attr,listener);
                            });
                            _destroy.call(self);
                        };
                    }
                }
            }
        };
        _target.prototype=target.prototype;
        return _target;
    }
}



class Context{
    public static mouseDownEvents="mousedown touchstart pointerdown";
    public static mouseMoveEvents="mousemove touchmove pointermove";
    public static mouseUpEvents="mouseup touchend pointerup";
    public static mouseOutEvents="mouseleave touchcancel pointerleave";
    
    public config: IConfig;
    public pageMap:Map<string,ITabBarItem>=new Map();
    public pageWbNumber?:string;
    public readonly toolbarInnerItems:IToolbarItem[]=[{
        title:"选择",
        type:INNER_TOOLBAR_ITEM_LIST.Selection
    },{
        title:"画笔",
        type:INNER_TOOLBAR_ITEM_LIST.Pencil,
    },{
        title:"文字",
        type:INNER_TOOLBAR_ITEM_LIST.Text
    },{
        title:"图形",
        type:INNER_TOOLBAR_ITEM_LIST.Shape
    },{
        title:"颜色",
        type:INNER_TOOLBAR_ITEM_LIST.Color
    },{
        title:"橡皮擦",
        type:INNER_TOOLBAR_ITEM_LIST.Erase
    },{
        title:"清空",
        type:INNER_TOOLBAR_ITEM_LIST.Clear
    },{
        title:"教鞭",
        type:INNER_TOOLBAR_ITEM_LIST.Ferule
    },{
        title:"撤销",
        type:INNER_TOOLBAR_ITEM_LIST.Undo
    },{
        title:"反撤销",
        type:INNER_TOOLBAR_ITEM_LIST.Redo
    }];
    
    
    private listenerMap:Map<string,Set<(changeAttr:string,attrVal:any,nextConfig:IConfig)=>void> >=new Map();//
    
    constructor(props:IConfigProps){
        const _config:IConfig={
            containerHeight:props.containerHeight,
            containerWidth:props.containerWidth,
            eraseSize:5,
            fill:undefined,
            selectionBorderColor:"rgba(255, 255, 255, 0.3)",
            selectionBorderWidth:1,
            selectionColor:"rgba(100, 100, 255, 0.3)",
            stroke:"red",
            strokeWidth:8,
            transformerAnchorStroke:"#09ca51",
            transformerAnchorWidth:1,
            transformerBorderStroke:"#09ca51",
            transformerBorderWidth:1,
        };
        const self = this;
        this.config=new Proxy(_config,{
            get(target: IConfig, p: string, receiver: any): any {
                return Reflect.get(target, p, receiver);
            },
            set(target: IConfig, p: string, value: any, receiver: any): boolean {
                const result = Reflect.set(target, p, value, receiver);
                // trigger listener
                const listerSet=self.listenerMap.get(p);
                if(listerSet){
                    listerSet.forEach((listener)=>{
                        listener(p,value,target);
                    })
                }
                console.log("set config");
                return result;
            }
        });
    }
   
    @Bind
    private addListener(attr:string,listener:(changeAttr:string,attrVal:any,nextConfig:IConfig)=>void){
        if(!this.listenerMap.has(attr)){
            this.listenerMap.set(attr,new Set<(changeAttr:string,attrVal:any,nextConfig:IConfig)=> void>());
        }
        this.listenerMap.get(attr)!.add(listener);
    }
    @Bind
    private removeListener(attr:string,listener:(changeAttr:string,attrVal:any,nextConfig:IConfig)=>void){
        if(this.listenerMap.has(attr)){
            this.listenerMap.get(attr)!.delete(listener);
        }
    }
}

export {Context}