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


declare interface IToolbarState {
    items:IToolbarItem[];
    context?:Context;
}

export declare interface IToolbarProps {
    onItemClick:(item:IToolbarItem)=>void;
}



class Toolbar extends React.PureComponent<IToolbarProps,IToolbarState>{
    constructor(props:IToolbarProps){
        super(props);
        this.state={
            items:[]
        }
    }
    @Bind
    public initItems(items:IToolbarItem[],context:Context){
        this.setState({
            context:context,
            items:items
        });
    }
    public render(){
        const {items,context} = this.state;
        return (
            <ul className="konvajs-toolbar">
                {
                    items.map((item)=>{
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
        this.props.onItemClick(item);
        // highlight
    }
}

export {Toolbar}