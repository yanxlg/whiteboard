/**
 * @disc:example
 * @author:yanxinaliang
 * @time：2018/6/9 20:34
 */
import {WhiteBoard} from '@/index';
import {TabBar} from '@/TabBar';
import {MapUtil} from '@/utils/MapUtil';
import {Bind} from 'lodash-decorators';
import React, {RefObject} from 'react';
import  ReactDOM from "react-dom";
import "./index.css";


class Test extends React.Component{
    private ref:RefObject<HTMLDivElement>=React.createRef();
    private whiteBoard?:WhiteBoard;
    public componentDidMount(): void {
        const container = this.ref.current;
        this.whiteBoard=new WhiteBoard(container as HTMLDivElement);
    }
    public render(){
        return (
            <React.Fragment>
                <TabBar onTabAdd={this.onTabAdd} onTabRemove={this.onTabRemove} onTabClick={this.onTabClick}/>
                <div style={{width:"100%",height:800,position:"relative"}} ref={this.ref}/>
            </React.Fragment>
        )
    }
    @Bind
    private onTabAdd(component:TabBar){
        const pageMap = this.whiteBoard!.config.pageMap;
        const wbNumber = Date.now().toString();
        pageMap.set(wbNumber,{
            label:"白板",
            wbNumber:wbNumber
        });
        this.whiteBoard!.config.update({
            pageMap:pageMap,
            pageWbNumber:wbNumber
        });
        component.updateTabList(MapUtil.toArray(pageMap),wbNumber);
    }
    @Bind
    private onTabRemove(rmWbNumber:string,pageWbNumber:string|undefined,component:TabBar){
        const pageMap = this.whiteBoard!.config.pageMap;
        pageMap.delete(rmWbNumber);
        this.whiteBoard!.config.update({
            pageMap:pageMap,
            pageWbNumber:pageWbNumber||undefined
        });
    }
    @Bind
    private onTabClick(wbNumber:string,component:TabBar){
        this.whiteBoard!.config.update({
            pageWbNumber:wbNumber||undefined
        });
    }
}


ReactDOM.render(
        <Test/>,
    document.getElementById('__react-content'),
);