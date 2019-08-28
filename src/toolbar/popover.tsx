/**
 * @disc:popover选择
 * @author:yanxinaliang
 * @time：2019/8/27 11:49
 */
import {IConfig} from '@/Context';
import {INNER_TOOLBAR_ITEM_LIST} from '@/toolbar/index';
import {ColorPopover} from '@/toolbar/popover/colorPopover';
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
        return (
                <_Popover placement="bottom-start" trigger="hover" content={(
                    type===INNER_TOOLBAR_ITEM_LIST.Color?<ColorPopover config={config}/>:<div>111</div>
                )}>
                    {
                        children
                    }
                </_Popover>
        );
    }
}

export {Popover}