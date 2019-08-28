/**
 * @disc:popover选择
 * @author:yanxinaliang
 * @time：2019/8/27 11:49
 */
import {IConfig} from '@/Context';
import {INNER_TOOLBAR_ITEM_LIST} from '@/toolbar/index';
import {ColorPopover} from '@/toolbar/popover/colorPopover';
import {ShapePopover} from '@/toolbar/popover/shapePopover';
import {TextPopover} from '@/toolbar/popover/textPopover';
import {Popover as _Popover} from 'element-react';
import React from 'react';

declare interface IPopOverProps {
    children:React.ReactElement;
    type:INNER_TOOLBAR_ITEM_LIST|string;
    config:IConfig;
}

class Popover extends React.PureComponent<IPopOverProps>{
    public render() {
        const {children,type,config} = this.props;
        return (type===INNER_TOOLBAR_ITEM_LIST.Color||type===INNER_TOOLBAR_ITEM_LIST.Shape||type===INNER_TOOLBAR_ITEM_LIST.Text)?(
                <_Popover placement="bottom-start" trigger="hover" content={(
                    type===INNER_TOOLBAR_ITEM_LIST.Color?<ColorPopover config={config}/>:
                        type===INNER_TOOLBAR_ITEM_LIST.Shape?<ShapePopover config={config}/>:
                            type===INNER_TOOLBAR_ITEM_LIST.Text?<TextPopover config={config}/>:
                                undefined
                )}>
                    {
                        children
                    }
                </_Popover>
        ):children;
    }
}

export {Popover}