import {Canvas} from '@/Canvas';
import {Config} from '@/Config';

class WhiteBoard{
    private readonly config:Config;
    constructor(container:string|HTMLDivElement){
        this.config=new Config();
        const containerEl = typeof container==="string"?document.querySelector(container) as HTMLDivElement:container;
        const width = containerEl.clientWidth;
        const height = containerEl.clientHeight;
        new Canvas({container:containerEl,height,width},this.config);
    }
}

export {WhiteBoard};