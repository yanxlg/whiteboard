/**
 * @disc:ToolbarItem
 * @author:yanxinaliang
 * @time：2019/8/27 11:47
 */
import {Context, decoratorFactory, IConfig} from '@/Context';
import {INNER_TOOLBAR_ITEM_LIST, IToolbarItem, IToolbarProps} from '@/Toolbar';
import {Popover} from '@/toolbar/popover';
import {Bind} from 'lodash-decorators';
import React from 'react';

declare interface IToolbarItemProps extends IToolbarItem,IToolbarProps{
    context:Context;
}

@decoratorFactory("color,tool")
class Item extends React.PureComponent<IToolbarItemProps>{
    public render(){
        const {type,title,component,context} = this.props;
        const tool = context.config.tool;
        const shapeType = context.config.shapeType;
        const className = type===INNER_TOOLBAR_ITEM_LIST.Selection?"eboard-icon eboard-icon-xuanze":
            type===INNER_TOOLBAR_ITEM_LIST.Pencil?"eboard-icon eboard-icon-huabi":
                type===INNER_TOOLBAR_ITEM_LIST.Text?"eboard-icon eboard-icon-wenzi":
                    type===INNER_TOOLBAR_ITEM_LIST.Shape?
                        `eboard-icon ${
                            shapeType==="line"?
                                "eboard-icon-zhixian":
                                shapeType==="circle"?
                                    "eboard-icon-shixinyuan":
                                    shapeType==="star"?
                                "eboard-icon-shixinxing":
                                        shapeType==="triangle"?
                                    "eboard-icon-shixinsanjiao":
                                            shapeType==="rect"?
                                        "eboard-icon-shixinfangxing":
                                                shapeType==="arrow"?
                                            "eboard-icon-jiantou":
                                                    shapeType==="hollow_circle"?
                                                "eboard-icon-kongxinyuan":
                                                        shapeType==="hollow_star"?
                                                    "eboard-icon-kongxinxing":
                                                            shapeType==="hollow_triangle"?
                                                        "eboard-icon-kongxinsanjiao":
                                                                shapeType==="hollow_rect"?
                                                            "eboard-icon-kongxinfangxing":
                                                            "eboard-icon-tuxing"
                        }`:
                        type===INNER_TOOLBAR_ITEM_LIST.Color?"eboard-icon eboard-icon-colour":
                            type===INNER_TOOLBAR_ITEM_LIST.Erase?"eboard-icon eboard-icon-rubber":
                                type===INNER_TOOLBAR_ITEM_LIST.Clear?"eboard-icon eboard-icon-qingkong":
                                    type===INNER_TOOLBAR_ITEM_LIST.Ferule?"eboard-icon eboard-icon-jiaobian":
                                        type===INNER_TOOLBAR_ITEM_LIST.Undo?"eboard-icon eboard-icon-revoke":
                                            type===INNER_TOOLBAR_ITEM_LIST.Redo?"eboard-icon eboard-icon-redo":undefined;
        const style = type===INNER_TOOLBAR_ITEM_LIST.Color?{color:context.config.color}:{};
        // popover
        return (
            <Popover type={type} config={context.config}>
                {
                    className?(
                        <li key={title} className={`konvajs-toolbar-item ${className} ${
                            tool==="selection"&&type===INNER_TOOLBAR_ITEM_LIST.Selection||
                                tool==="shape"&&type===INNER_TOOLBAR_ITEM_LIST.Shape||
                                tool==="pencil"&&type===INNER_TOOLBAR_ITEM_LIST.Pencil||
                                tool==="text"&&type===INNER_TOOLBAR_ITEM_LIST.Text||
                                tool==="erase"&&type===INNER_TOOLBAR_ITEM_LIST.Erase||
                                tool==="ferule"&&type===INNER_TOOLBAR_ITEM_LIST.Ferule?"konvajs-toolbar-active":""
                        }`} title={title} style={style} onClick={this.onItemClick}/>
                    ):React.cloneElement(component!,{
                        key:title,
                        onClick:this.onItemClick,
                        title:title
                    })
                }
            </Popover>
        )
    }
    public componentWillUnmount(): void {
        // clear
    }
    @Bind
    private onItemClick(){
        const {onItemClick,...props} = this.props;
        this.props.onItemClick(props);
    }
    
    private onConfigUpdate(attr:string,value:any,nextConfig:IConfig){
        const type = this.props.type;
        if(type===INNER_TOOLBAR_ITEM_LIST.Color&&attr==="color"||attr==="tool"){
            this.forceUpdate();
        }
    }
}


export {Item};