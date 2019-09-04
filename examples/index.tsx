/**
 * @disc:example
 * @author:yanxinaliang
 * @time：2018/6/9 20:34
 */
import {WhiteBoard} from '@/index';
import {TabBar} from '@/TabBar';
import {Toolbar} from '@/Toolbar';
import React, {RefObject} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Test extends React.Component{
    private ref:RefObject<HTMLDivElement>=React.createRef();
    private whiteBoard:WhiteBoard;
    private toolBarRef:RefObject<Toolbar>=React.createRef();
    constructor(props:{}){
        super(props);
        this.whiteBoard=new WhiteBoard();
    }
    public componentDidMount(): void {
        const container = this.ref.current;
        this.whiteBoard.init(container as HTMLDivElement);
    }
    public render(){
        return (
            <React.Fragment>
                <TabBar context={this.whiteBoard.context} openNewPage={this.whiteBoard.openNewPage} reOpenPage={this.whiteBoard.reOpenPage}/>
                <Toolbar ref={this.toolBarRef} context={this.whiteBoard.context}/>
                <div style={{width:"100%",height:800,position:"relative"}} ref={this.ref}/>
            </React.Fragment>
        )
    }
}


ReactDOM.render(
        <Test/>,
    document.getElementById('__react-content'),
);