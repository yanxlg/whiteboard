/**
 * @disc:$DESC$
 * @type:$TYPE$
 * @dependence:$DEPENDENCE$
 * @author:yanxinaliang
 * @time：2018/7/4 15:18
 */
var open = require("open");
var port = require("../package.json").config.port;
open(`http://localhost:${port}/examples/index.html`);