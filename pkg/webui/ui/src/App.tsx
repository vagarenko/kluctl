import React, { useEffect, useState } from 'react';
import 'reactflow/dist/style.css';

import './index.css';
import CommandResultFlow from "./CommandResultFlow";
import { listResults } from "./api";

const App = () => {
    const [resultId, setResultId] = useState("")

    useEffect(() => {
        listResults().then(ids => {
            let firstId = ids[0]
            setResultId(firstId)
        })
    }, []);

    return (
        <div className="layoutflow">
            {resultId ? <CommandResultFlow resultId={resultId}/> : "Loading"}
        </div>
    );
};

export default App;
