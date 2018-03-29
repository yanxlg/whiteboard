/**
 * 需要记录操作历史ActionList，以便做还原
 */
import React from "react";
import {fabric} from "fabric";
import {Canvas, Circle} from "fabric/fabric-impl";
import "../style/index.scss";

/**
 * 教鞭类
 */
class Ferula{
    private _canvas:Canvas=null;
    private mouseShape:Circle=null;
    private fill:string="red";
    private size:number=5;//size 而非半径是为了兼容以后其他形状   暂时支持像素，后续考虑rem
    private cacheSetting:any={};
    private inited:boolean=false;
    constructor(canvas:Canvas){
        this._canvas=canvas;
    }
    init=()=>{
        //仅支持一次初始化
        if(this.inited){return}
        this.inited=true;
        this.cacheSetting={
            selection:this._canvas.selection,
            skipTargetFind:this._canvas.skipTargetFind
        };
        this._canvas.selection = false;//禁止选择
        this._canvas.skipTargetFind = true;//禁止对象查找
        this._canvas.on('mouse:move', (o)=>{
            let pos = this._canvas.getPointer(o.e);
            if (this.mouseShape) {
                //TODO 颜色和半径可能调整
                this.mouseShape.set({
                    left: pos.x,
                    top: pos.y,
                    fill:this.fill,
                    radius:this.size
                });
                this._canvas.requestRenderAll();//requestRenderAll会有一些卡顿，虽然对于性能体验会减轻压力，但是此处不使用
            }
            else {
                this.mouseShape = new fabric.Circle({
                    originX:"center",
                    originY:"center",
                    selectable: false,
                    radius: this.size,
                    fill:this.fill,
                    left: pos.x,
                    top: pos.y
                });
                this._canvas.add(this.mouseShape);
            }
        });
    };
    remove=()=>{
        if(this.inited){
            if(this.mouseShape){
                this._canvas.remove(this.mouseShape);
                this.mouseShape=null;
            }
            this._canvas.off('mouse:move');
            //设置还原
            this._canvas.selection = this.cacheSetting.selectable;
            this._canvas.skipTargetFind =  this.cacheSetting.skipTargetFind;
            this.inited=false;
        }
    };
    setSize=(size:number)=>{
      this.size=size;
    };
    setFill=(fill:string)=>{
        this.fill=fill;
    };
    destory=()=>{

    }
}


class Index extends React.Component{
    private ACTION_LIST:any[]=[];
    __canvas:Canvas=null;
    canvasSeat:HTMLCanvasElement=null;
    ferula:Ferula=null;
    constructor(props:any){
        super(props);
    }
    componentDidMount(){
        this.__canvas=new fabric.Canvas(this.canvasSeat);
        this.ferula=new Ferula(this.__canvas);
    }
    startFerula=()=>{
        this.ferula.init();
    };
    stopFerula=()=>{
      this.ferula.remove();
    };
    render(){
        return (
            [
                <div className="whiteboard-wrap">
                    <div className="whiteboard-html"/>
                    <canvas className="whiteboard-canvas" width={800} height={500} ref={(ref)=>this.canvasSeat=ref}/>
                </div>,
                <button onClick={this.startFerula}>教鞭</button>,
                <button onClick={this.stopFerula}>清除教鞭</button>
            ]
        )
    }
}

export {Index};