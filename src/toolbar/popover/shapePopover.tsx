/**
 * @disc:ShapePopover
 * @author:yanxinaliang
 * @time：2019/8/28 15:46
 */
import {IConfig} from '@/Context';
import "@/icons/iconfont.css";
import "@/less/toolbar.less";
import {Bind} from 'lodash-decorators';
import React, {MouseEvent} from 'react';

declare interface IShapePopoverProps {
    config:IConfig;
}

class ShapePopover extends React.Component<IShapePopoverProps>{
    private currentShapeType?:string;
    public shouldComponentUpdate(
        nextProps: Readonly<IShapePopoverProps>, nextState: Readonly<{}>,
        nextContext: any): boolean {
        return this.currentShapeType!==nextProps.config.shapeType;
    }
    public render(){
        const {shapeType} = this.props.config;
        this.currentShapeType=shapeType;
        return (
            <React.Fragment>
                <div>
                    <div title="直线" className={`konvajs-toolbar-popover-item eboard-icon eboard-icon-zhixian ${shapeType==="line"?"konvajs-toolbar-active":""}`} onClick={this.onItemClick}/>
                    <div title="实心圆" className={`konvajs-toolbar-popover-item eboard-icon eboard-icon-shixinyuan ${shapeType==="circle"?"konvajs-toolbar-active":""}`} onClick={this.onItemClick}/>
                    <div title="实心星" className={`konvajs-toolbar-popover-item eboard-icon eboard-icon-shixinxing ${shapeType==="star"?"konvajs-toolbar-active":""}`} onClick={this.onItemClick}/>
                    <div title="实心三角" className={`konvajs-toolbar-popover-item eboard-icon eboard-icon-shixinsanjiao ${shapeType==="triangle"?"konvajs-toolbar-active":""}`} onClick={this.onItemClick}/>
                    <div title="实心方形" className={`konvajs-toolbar-popover-item eboard-icon eboard-icon-shixinfangxing ${shapeType==="rect"?"konvajs-toolbar-active":""}`} onClick={this.onItemClick}/>
                </div>
                <div>
                    <div title="箭头" className={`konvajs-toolbar-popover-item eboard-icon eboard-icon-jiantou ${shapeType==="arrow"?"konvajs-toolbar-active":""}`} onClick={this.onItemClick}/>
                    <div title="空心圆" className={`konvajs-toolbar-popover-item eboard-icon eboard-icon-kongxinyuan ${shapeType==="hollow_circle"?"konvajs-toolbar-active":""}`} onClick={this.onItemClick}/>
                    <div title="空心星" className={`konvajs-toolbar-popover-item eboard-icon eboard-icon-kongxinxing ${shapeType==="hollow_star"?"konvajs-toolbar-active":""}`} onClick={this.onItemClick}/>
                    <div title="空心三角" className={`konvajs-toolbar-popover-item eboard-icon eboard-icon-kongxinsanjiao ${shapeType==="hollow_triangle"?"konvajs-toolbar-active":""}`} onClick={this.onItemClick}/>
                    <div title="空心方形" className={`konvajs-toolbar-popover-item eboard-icon eboard-icon-kongxinfangxing ${shapeType==="hollow_rect"?"konvajs-toolbar-active":""}`} onClick={this.onItemClick}/>
                </div>
            </React.Fragment>
        )
    }
    @Bind
    private onItemClick(e:MouseEvent<HTMLDivElement>){
        const target = e.target as HTMLDivElement;
        const title = target.title;
        this.props.config.tool="shape";
        this.props.config.shapeType=
            title==="直线"?"line":
                title==="实心圆"?"circle":
                    title==="实心星"?"star":
                        title==="实心三角"?"triangle":
                            title==="实心方形"?"rect":
                                title==="箭头"?"arrow":
                                    title==="空心圆"?"hollow_circle":
                                        title==="空心星"?"hollow_star":
                                            title==="空心三角"?"hollow_triangle": "hollow_rect";
    }
}
export {ShapePopover}