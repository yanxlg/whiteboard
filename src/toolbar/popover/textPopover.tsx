/**
 * @disc:TextPopover
 * @author:yanxinaliang
 * @time：2019/8/28 16:23
 */

import {IConfig} from '@/Context';
import React from "react";


declare interface ITextPopoverProps {
    config:IConfig
}

class TextPopover extends React.PureComponent<ITextPopoverProps>{
    public render(){
        return (
            <React.Fragment>
                <div className="konvajs-toolbar-popover-item">
                    14
                </div>
                <div className="konvajs-toolbar-popover-item">
                    18
                </div>
                <div className="konvajs-toolbar-popover-item">
                    24
                </div>
                <div className="konvajs-toolbar-popover-item">
                    26
                </div>
            </React.Fragment>
        )
    }
}

export {TextPopover};