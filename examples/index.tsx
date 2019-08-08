/**
 * @disc:example
 * @author:yanxinaliang
 * @time：2018/6/9 20:34
 */
import {WhiteBoard} from '@/index';
import  React from "react";
import  ReactDOM from "react-dom";
import "./index.css";


class Test extends React.Component{
    public componentDidMount(): void {
        const container = ReactDOM.findDOMNode(this);
        new WhiteBoard(container as HTMLDivElement);
    }
    public render(){
        return (
            <div style={{width:"100%",height:800,position:"relative"}}/>
        )
    }
}


ReactDOM.render(
        <Test/>,
    document.getElementById('__react-content'),
);