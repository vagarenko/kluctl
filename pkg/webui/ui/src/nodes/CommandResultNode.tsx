import React, {memo} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';

import "./nodes.css"
import {CommandResult} from "../models";

export type CommandResultNodeData = {
    commandResult: CommandResult
}

export default memo((props: NodeProps<CommandResultNodeData>) => {
    return (
        <>
            <div>
                <strong>CommandResult</strong><br/>
                command: {props.data.commandResult.command!.command}<br/>
                target: {props.data.commandResult.command!.target!.name}<br/>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                id="b"
                style={{bottom: 10, top: 'auto', background: '#555'}}
                isConnectable={props.isConnectable}
            />
        </>
    );
});
