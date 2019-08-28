/**
 * @disc:example
 * @author:yanxinaliang
 * @time：2018/6/9 20:34
 */
import {WhiteBoard} from '@/index';
import {TabBar} from '@/TabBar';
import {INNER_TOOLBAR_ITEM_LIST, IToolbarItem, Toolbar} from '@/Toolbar';
import {MapUtil} from '@/utils/MapUtil';
import {Bind} from 'lodash-decorators';
import React, {RefObject} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Test extends React.Component{
    private ref:RefObject<HTMLDivElement>=React.createRef();
    private whiteBoard?:WhiteBoard;
    private toolBarRef:RefObject<Toolbar>=React.createRef();
    public componentDidMount(): void {
        const container = this.ref.current;
        this.whiteBoard=new WhiteBoard(container as HTMLDivElement);
        this.toolBarRef.current!.initItems(this.whiteBoard.context.toolbarInnerItems,this.whiteBoard.context);
    }
    public render(){
        return (
            <React.Fragment>
                <TabBar onTabAdd={this.onTabAdd} onTabRemove={this.onTabRemove} onTabClick={this.onTabClick}/>
                <Toolbar ref={this.toolBarRef} onItemClick={this.onToolbarItemClick}/>
                <div style={{width:"100%",height:800,position:"relative"}} ref={this.ref}/>
            </React.Fragment>
        )
    }
    @Bind
    private onTabAdd(){
        const pageMap = this.whiteBoard!.context.pageMap;
        const wbNumber = Date.now().toString();
        pageMap.set(wbNumber,{
            label:"白板",
            wbNumber:wbNumber
        });
        this.whiteBoard!.config.update({
            pageMap:pageMap,
            pageWbNumber:wbNumber
        });
        return {
            pageWbNumber:wbNumber,
            tabs:MapUtil.toArray(pageMap)
        }
    }
    @Bind
    private onTabRemove(rmWbNumber:string,pageWbNumber:string|undefined){
        const pageMap = this.whiteBoard!.context.pageMap;
        pageMap.delete(rmWbNumber);
        this.whiteBoard!.config.update({
            pageMap:pageMap,
            pageWbNumber:pageWbNumber||undefined
        });
        return {
            pageWbNumber:pageWbNumber||undefined,
            tabs:MapUtil.toArray(pageMap)
        }
    }
    @Bind
    private onTabClick(wbNumber:string){
        this.whiteBoard!.context.update({
            pageWbNumber:wbNumber||undefined
        });
    }
    @Bind
    private onToolbarItemClick(item:IToolbarItem){
        switch (item.type) {
            case INNER_TOOLBAR_ITEM_LIST.Selection:
                this.whiteBoard!.context.config.tool="selection";
                break;
            case INNER_TOOLBAR_ITEM_LIST.Pencil:
                this.whiteBoard!.context.config.tool="pencil";
                break;
            case INNER_TOOLBAR_ITEM_LIST.Text:
                this.whiteBoard!.context.config.tool="text";
                break;
            case INNER_TOOLBAR_ITEM_LIST.Shape:
                this.whiteBoard!.context.config.tool="shape";
                break;
            case INNER_TOOLBAR_ITEM_LIST.Erase:
                this.whiteBoard!.context.config.tool="erase";
                break;
            case INNER_TOOLBAR_ITEM_LIST.Ferule:
                this.whiteBoard!.context.config.tool="ferule";
                break;
        }
        
    }
}


ReactDOM.render(
        <Test/>,
    document.getElementById('__react-content'),
);