/**
 * @disc:TextPopover
 * @author:yanxinaliang
 * @time：2019/8/28 16:23
 */

import {IConfig} from '@/Context';
import {Bind} from 'lodash-decorators';
import React, {MouseEvent} from 'react';


declare interface ITextPopoverProps {
    config:IConfig
}

class TextPopover extends React.Component<ITextPopoverProps>{
    private currentFontSize?:number;
    public shouldComponentUpdate(
        nextProps: Readonly<ITextPopoverProps>, nextState: Readonly<{}>,
        nextContext: any): boolean {
        console.log(nextProps.config.fontSize);
        return this.currentFontSize!==nextProps.config.fontSize;
    }
    public render(){
        const {fontSize} = this.props.config;
        this.currentFontSize=fontSize;
        return (
            <React.Fragment>
                <div title="14px" className={`konvajs-toolbar-popover-item ${fontSize===14?"konvajs-toolbar-active":""}`} onClick={this.onFontSizeChange}>
                    14
                </div>
                <div title="18px" className={`konvajs-toolbar-popover-item ${fontSize===18?"konvajs-toolbar-active":""}`} onClick={this.onFontSizeChange}>
                    18
                </div>
                <div title="24px" className={`konvajs-toolbar-popover-item ${fontSize===24?"konvajs-toolbar-active":""}`} onClick={this.onFontSizeChange}>
                    24
                </div>
                <div title="26px" className={`konvajs-toolbar-popover-item ${fontSize===25?"konvajs-toolbar-active":""}`} onClick={this.onFontSizeChange}>
                    26
                </div>
            </React.Fragment>
        )
    }
    @Bind
    private onFontSizeChange(e:MouseEvent<HTMLDivElement>){
        const target = e.target as HTMLDivElement;
        const title = target.title;
        this.props.config.tool="text";
        this.props.config.fontSize=parseInt(title,10);
    }
}

export {TextPopover};