/**
 * @disc:DESC
 * @type:TYPE
 * @dependence:DEPENDENCE
 * @author:yanxinaliang
 * @time：2019/8/23 11:52
 */
import {Context, decoratorFactory, IConfig} from '@/Context';
import {Page} from '@/Page';
import {Tabs} from 'element-react';
import 'element-theme-default';
import {Bind} from 'lodash-decorators';
import React, {RefObject} from 'react';
import TabsPane = ElementReact.TabsPane;


export declare interface ITabBarItem {
    label:string;
    icon?:string;
    wbNumber:string;
    closable?:boolean;
    disabled?:boolean;
    pageInstance?:Page
}

export declare interface ITabBarState {
    tabs:ITabBarItem[];
    tabNumber?:string;
}

export declare interface ITabBarProps {
    context:Context;
    openNewPage:()=>void;
    reOpenPage:(wbNumber:string)=>void;
}


@decoratorFactory("tabs,tabNumber")
class TabBar extends React.PureComponent<ITabBarProps,ITabBarState>{
    private tabBarRef: RefObject<Tabs>=React.createRef();
    constructor(props:ITabBarProps) {
        super(props);
        this.state={
            tabNumber:props.context.config.tabNumber,
            tabs:props.context.config.tabs
        };
    }
   
    public componentWillUnmount(): void {
        // clear
    }
    public render() {
        const {tabNumber="none",tabs} = this.state;
        return (
            <Tabs ref={this.tabBarRef} type="border-card" value={tabNumber} className="konvajs-tabs" editable={true} onTabEdit={this.editTab} onTabClick={this.onTabClick}>
                {
                    tabs.map((item) => {
                        const {closable=true,disabled=false,label,wbNumber} = item;
                        return <Tabs.Pane key={wbNumber} closable={closable} disabled={disabled} label={label} name={wbNumber}/>
                    })
                }
            </Tabs>
        )
    }
    private onConfigUpdate(attr:string,value:any,nextConfig:IConfig){
        this.setState({
            tabNumber:nextConfig.tabNumber,
            tabs:nextConfig.tabs
        },()=>{
            // @ts-ignore
            this.tabBarRef.current!.scrollToActiveTab();// fix active Tab position
        });
    }
    @Bind
    private editTab(action:"add"|"remove", tabItem:any) {
        if (action === 'add') {
            this.props.openNewPage();
        }
        if (action === 'remove') {
            const nextPageWbNumber=tabItem._owner.child.memoizedState.currentName;
            this.props.context.config.tabs=this.props.context.config.tabs.filter((tab)=>{
                return tab.wbNumber!==tabItem.props.name
            });
            this.props.reOpenPage(nextPageWbNumber);
            this.props.context.config.tabNumber=nextPageWbNumber;
        }
    }
    @Bind
    private onTabClick(tabItem:TabsPane){
        this.props.reOpenPage(tabItem.props.name!);
        this.props.context.config.tabNumber=tabItem.props.name!;
    }
}

export {TabBar};