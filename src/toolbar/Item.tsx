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

@decoratorFactory("stroke,fill")
class Item extends React.PureComponent<IToolbarItemProps>{
    public render(){
        const {type,title,component,context} = this.props;
        const className = type===INNER_TOOLBAR_ITEM_LIST.Selection?"eboard-icon eboard-icon-xuanze":
            type===INNER_TOOLBAR_ITEM_LIST.Pencil?"eboard-icon eboard-icon-huabi":
                type===INNER_TOOLBAR_ITEM_LIST.Text?"eboard-icon eboard-icon-wenzi":
                    type===INNER_TOOLBAR_ITEM_LIST.Shape?"eboard-icon eboard-icon-tuxing":
                        type===INNER_TOOLBAR_ITEM_LIST.Color?"eboard-icon eboard-icon-colour":
                            type===INNER_TOOLBAR_ITEM_LIST.Erase?"eboard-icon eboard-icon-rubber":
                                type===INNER_TOOLBAR_ITEM_LIST.Clear?"eboard-icon eboard-icon-qingkong":
                                    type===INNER_TOOLBAR_ITEM_LIST.Ferule?"eboard-icon eboard-icon-jiaobian":
                                        type===INNER_TOOLBAR_ITEM_LIST.Undo?"eboard-icon eboard-icon-revoke":
                                            type===INNER_TOOLBAR_ITEM_LIST.Redo?"eboard-icon eboard-icon-redo":undefined;
        const style = type===INNER_TOOLBAR_ITEM_LIST.Color?{color:context.config.stroke||context.config.fill}:{};
        // popover
        return (
            <Popover type={type} config={context.config}>
                {
                    className?(
                        <li key={title} className={`konvajs-toolbar-item ${className}`} title={title} style={style} onClick={this.onItemClick} />
                    ):React.cloneElement(component!,{
                        key:title,
                        onClick:this.onItemClick,
                        title:title
                    })
                }
            </Popover>
        )
    }
    @Bind
    private onItemClick(){
        const {onItemClick,...props} = this.props;
        this.props.onItemClick(props);
    }
    
    private onConfigUpdate(attr:string,value:any,nextConfig:IConfig){
        if(this.props.type===INNER_TOOLBAR_ITEM_LIST.Color&&(attr==="stroke"||attr==="fill")){
            this.setState({});
        }
    }
}


export {Item};