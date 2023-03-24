import React, { memo } from 'react';
import { NodeProps } from 'reactflow';

import "./nodes.css"
import { CommandResult } from "../models";
import GenericNode from './GenericNode';

export type CommandResultNodeData = {
    commandResult: CommandResult
}

export default memo((props: NodeProps<CommandResultNodeData>) => {
    return (
        <GenericNode
            header="CommandResult"
            body={<>
                command: {props.data.commandResult.command!.command}<br />
                target: {props.data.commandResult.command!.target!.name}<br />
            </>}
            rightHandleIds={["b"]}
            nodeProps={props}
        />
    );
});
