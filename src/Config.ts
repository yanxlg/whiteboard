/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/5 13:53
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/5 13:53
 * @disc:Config 配置
 */


export type IConfig = {[K in keyof Config]:Config[K]};

class Config{
    public fill?:string;
    public stroke?:string;
    public strokeWidth:number;
    public selectionColor:string;
    public selectionBorderColor:string;
    public selectionBorderWidth:number;
    public transformerBorderStroke:string;
    public transformerBorderWidth:number;
    public transformerAnchorStroke:string;
    public transformerAnchorWidth:number;
    public brush?:"pencil"|"arrow"|"line"|"circle"|"rect"|"square"|"ellipse"|"wedge"|"star"|"ring"|"arc"|"polygon"|"text";
    public tool?:"transform"="transform";
    public mouseDownEvents="mousedown touchstart pointerdown";
    public mouseMoveEvents="mousemove touchmove pointermove";
    public mouseUpEvents="mouseup touchend pointerup";
    public mouseOutEvents="mouseleave touchcancel pointerleave";
    private updateListenerWeakSet:Set<(prevConfig:IConfig,nextConfig:IConfig)=>void>=new Set<(prevConfig:IConfig,nextConfig:IConfig)=> void>();
    constructor(){
        this.fill=undefined;
        this.stroke="black";
        this.strokeWidth=1;
        this.selectionColor="rgba(100, 100, 255, 0.3)";
        this.selectionBorderColor="rgba(255, 255, 255, 0.3)";
        this.selectionBorderWidth=1;
        this.transformerBorderStroke=this.transformerAnchorStroke="#09ca51";
        this.transformerBorderWidth=this.transformerAnchorWidth=1;
    }
    public update(config:IConfig,callback?:()=>void){
        const prevConfig = JSON.parse(JSON.stringify(this));
        Object.assign(this,config);
        this.updateListenerWeakSet.forEach((listener)=>{
            listener(prevConfig,this);
        });
        callback&&callback();
    }
    public listener(listener:(prevConfig:IConfig,nextConfig:IConfig)=>void){
        this.updateListenerWeakSet.add(listener);
    }
    public offListener(listener:(prevConfig:IConfig,nextConfig:IConfig)=>void){
        this.updateListenerWeakSet.delete(listener);
    }
}

export {Config}