import React from 'react';
import ReactDOM from 'react-dom';
import { Routers } from "../router";

ReactDOM.render(
        <Routers/>,
    document.getElementById("react-container"));

require("../common/utils/registerServiceWorker").default();
