/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/14 17:39
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/14 17:39
 * @disc:ScrollBox
 *
 * Emulate screen moving with transform. can performance better
 *
 */
import {Bind} from 'lodash-decorators';

class ScrollBox {
    public scrollContainer:HTMLDivElement;
    public largeContainer:HTMLDivElement;
    public container:HTMLDivElement;
    private PADDING:number;// so scrolling will look smoother
    private callback:(dx:number,dy:number)=>void;
    constructor(parent:HTMLDivElement,offsetWidth:number,offsetHeight:number,scrollWidth:number,scrollHeight:number,callback:(dx:number,dy:number)=>void){// callback中init stage
        this.PADDING=(scrollHeight-offsetHeight)/2;// update PADDING value
        this.callback=callback;
        this.scrollContainer=document.createElement("div");
        this.scrollContainer.className="konvajs-scroll";
        this.largeContainer=document.createElement("div");
        this.largeContainer.className="konvajs-large";
        this.container=document.createElement("div");
        this.container.className="konvajs-container";
        this.scrollContainer.style.width=`${offsetWidth}px`;
        this.scrollContainer.style.height=`${offsetHeight}px`;
        this.largeContainer.style.width=`${scrollWidth}px`;
        this.largeContainer.style.height=`${scrollHeight}px`;
        this.largeContainer.appendChild(this.container);
        this.scrollContainer.appendChild(this.largeContainer);
        parent.appendChild(this.scrollContainer);
        this.scrollContainer.addEventListener("scroll",this.repositionStage);
        this.repositionStage();
    }
/*    @Bind
    public update(offsetWidth:number,offsetWidth:number,scrollWidth:number,scrollHeight:number){
    
    }*/
    @Bind
    private repositionStage(){
        const dy = this.scrollContainer.scrollTop - this.PADDING;
        this.container.style.transform ='translate(0px, ' + dy + 'px)';
        this.callback(0,dy);
        
    /*    stage.x(-dx);
        stage.y(-dy);
        stage.batchDraw();*/
    }
}

export {ScrollBox}