/**
 * @disc:DESC
 * @type:TYPE
 * @dependence:DEPENDENCE
 * @author:yanxinaliang
 * @time：2019/8/23 11:52
 */
import {Tabs} from 'element-react';
import 'element-theme-default';
import {Bind} from 'lodash-decorators';
import React from "react";
import TabsPane = ElementReact.TabsPane;


export declare interface ITabBarItem {
    label:string;
    icon?:string;
    wbNumber:string;
    closable?:boolean;
    disabled?:boolean;
}

export declare interface ITabBarState {
    tabs:ITabBarItem[];
    pageWbNumber?:string;
}

export declare interface ITabBarProps {
    onTabAdd:(component:TabBar)=>void;
    onTabRemove:(rmWbNumber:string,activeWbNumber:string|undefined,component:TabBar)=>void;
    onTabClick:(wbNumber:string,component:TabBar)=>void;
}


class TabBar extends React.PureComponent<ITabBarProps,ITabBarState>{
    constructor(props:ITabBarProps) {
        super(props);
        this.state={
            tabs:[]
        };
    }
    
    @Bind
    public updateTabList(tabs:ITabBarItem[],pageWbNumber?:string){
        this.setState((state)=>{
            return {
                pageWbNumber:pageWbNumber||state.pageWbNumber,
                tabs
            }
        });
    }
    public render() {
        const {pageWbNumber="none",tabs} = this.state;
        return (
            <Tabs type="card" value={pageWbNumber} className="konvajs-tabs" editable={true} onTabEdit={this.editTab} onTabClick={this.onTabClick}>
                {
                    tabs.map((item) => {
                        const {closable=true,disabled=false,label,wbNumber} = item;
                        return <Tabs.Pane key={wbNumber} closable={closable} disabled={disabled} label={label} name={wbNumber}/>
                    })
                }
            </Tabs>
        )
    }
    @Bind
    private editTab(action:"add"|"remove", tabItem:any) {
        if (action === 'add') {
            // 创建一个tab
            this.props.onTabAdd(this);
        }
        if (action === 'remove') {
            const nextPageWbNumber=tabItem._owner.child.memoizedState.currentName;
            this.props.onTabRemove(tabItem.props.name,nextPageWbNumber,this);
        }
    }
    @Bind
    private onTabClick(tabItem:TabsPane){
        this.props.onTabClick(tabItem.props.name!,this);
    }
}

export {TabBar};