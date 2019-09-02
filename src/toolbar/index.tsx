/**
 * @disc:DESC
 * @type:TYPE
 * @dependence:DEPENDENCE
 * @author:yanxinaliang
 * @time：2019/8/23 11:52
 */
import {Context, IConfig} from '@/Context';
import "@/icons/iconfont.css";
import "@/less/toolbar.less";
import {Item} from '@/toolbar/Item';
import {Bind} from 'lodash-decorators';
import React from "react";


export enum INNER_TOOLBAR_ITEM_LIST {
    Selection="selection",
    Pencil="pencil",
    Text="text",
    Color="color",
    Shape="shape",
    Erase="erase",
    Ferule="ferule",
    Clear="clear",
    Undo="undo",
    Redo="redo"
}

// 内置itemList 支持extra 扩展
export declare interface IToolbarItem {
    type:INNER_TOOLBAR_ITEM_LIST|string;
    component?:React.ReactElement;
    title:string;
}


export declare interface IToolbarProps {
    context:Context;
}



class Toolbar extends React.PureComponent<IToolbarProps>{
    public render(){
        const {context} = this.props;
        return (
            <ul className="konvajs-toolbar">
                {
                    context.toolbarInnerItems.map((item)=>{
                        return (
                            <Item key={item.type} {...item} context={context!} onItemClick={this.onItemClick}/>
                        )
                    })
                }
            </ul>
        )
    }
    @Bind
    private onItemClick(item:IToolbarItem){
        switch (item.type) {
            case INNER_TOOLBAR_ITEM_LIST.Selection:
                this.props.context.config.tool="selection";
                break;
            case INNER_TOOLBAR_ITEM_LIST.Pencil:
                this.props.context.config.tool="pencil";
                break;
            case INNER_TOOLBAR_ITEM_LIST.Text:
                this.props.context.config.tool="text";
                break;
            case INNER_TOOLBAR_ITEM_LIST.Shape:
                this.props.context.config.tool="shape";
                break;
            case INNER_TOOLBAR_ITEM_LIST.Erase:
                this.props.context.config.tool="erase";
                break;
            case INNER_TOOLBAR_ITEM_LIST.Ferule:
                this.props.context.config.tool="ferule";
                break;
            case INNER_TOOLBAR_ITEM_LIST.Clear:
                this.props.context.config.tool="clear";
                break;
        }
    }
}

export {Toolbar}