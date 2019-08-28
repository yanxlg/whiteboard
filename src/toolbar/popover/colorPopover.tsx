/**
 * @disc:ColorPopover
 * @author:yanxinaliang
 * @time：2019/8/27 13:35
 */
import {ColorPicker} from '@/colorPicker';
import {IConfig} from '@/Context';
import {Bind} from 'lodash-decorators';
import React, {PureComponent, RefObject} from 'react';


declare interface IColorPopoverProps {
    config:IConfig;
}


class ColorPopover extends PureComponent<IColorPopoverProps>{
    private colorPicker:any;
    private container:RefObject<HTMLDivElement>=React.createRef();
    public componentDidMount(): void {
        this.colorPicker = new ColorPicker({
            actionCallback:this.onColorPickerActionCallback,
            appendTo:this.container.current,
            color:this.props.config.color,
            customBG: '#808080',
            imagePath: 'images/',
            memoryColors: [
                {r: 255, g: 255, b: 255, a: 1},
                {r:0,g:0,b:0,a:1},
                {r:242,g:37,b:0,a:1},
                {r:246,g:108,b:0,a:1},
                {r:250,g:213,b:0,a:1},
                {r:100,g:203,b:0,a:1},
                {r:0,g:202,b:196,a:1},
                {r:54,g:152,b:243,a:1},
                {r:139,g:109,b:197,a:1},
                {r:255,g:124,b:129,a:1},
            ],
            noResize:true
        });
    }
    public render() {
        return (
            <div ref={this.container}/>
        );
    }
    @Bind
    private onColorPickerActionCallback(e:MouseEvent, action:string){
        if(action==="saveAsBackground"||action==="fromMemory"){
            this.props.config.color=`#${this.colorPicker.color.colors.HEX}`;
        }
        if(action==="resetColor"){
            // cancel picker
        }
    }
}

export {ColorPopover}