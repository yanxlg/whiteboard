/**
 * @disc:example
 * @author:yanxinaliang
 * @time：2018/6/9 20:34
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import "react-custom-scroll/dist/customScroll.css";
import "./index.css";
import Scrollbar from '../src/scrollbar';
import {RefObject} from 'react';


class Test extends React.Component<{},{}>{
    private scrollRef:RefObject<Scrollbar>=React.createRef();
    constructor(props:{}){
        super(props);
    }
    componentDidMount(): void {
    }
    private onClick=()=>{
        this.scrollRef.current.scrollToTop(true);
    }
    private onScrollStop=()=>{
        console.log("stop");
    }
    render(){
        return (
            <div style={{position:"absolute",width:"100%",height:"100%",overflow:"hidden",zIndex:100,backgroundColor:"white",left:0,top:0}}>
                <Scrollbar ref={this.scrollRef} scrollBounce={false} onScrollStop={this.onScrollStop}>
                    {
                        new Array(100).fill(1).map((value,index)=>{
                            return <div style={{height:50}}>
                                {index}
                            </div>
                        })
                    }
                </Scrollbar>
                <button style={{position:"absolute",zIndex:999,left:0,top:0}} onClick={this.onClick}>返回顶部</button>
            </div>
        )
    }
}

ReactDOM.render(
    <div>
        <Test/>
    </div>,
    document.getElementById('__react-content'),
);