import React, {memo} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';

import "./nodes.css"
import {CommandResult, VarsSource} from "../models";

export type VarsSourceNodeData = {
    commandResult: CommandResult
    varsSource: VarsSource
}

export default memo((props: NodeProps<VarsSourceNodeData>) => {
    return (
        <>
            <div>
                <strong>VarsSource</strong><br/>
                varsCount: {Object.keys(props.data.varsSource.renderedVars?.object).length}
            </div>

            <Handle
                type="target"
                position={Position.Left}
                id="parent"
                style={{bottom: 10, top: 'auto', background: '#555'}}
                isConnectable={true}
            />
        </>
    );
});
