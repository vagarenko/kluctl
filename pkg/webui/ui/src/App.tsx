import React from 'react';
import 'reactflow/dist/style.css';

import './index.css';
import CommandResultFlow from "./CommandResultFlow";

const App = () => {

    return (
        <div className="layoutflow">
            <CommandResultFlow/>
        </div>
    );
};

export default App;
