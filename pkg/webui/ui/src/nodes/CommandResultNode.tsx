import React, { memo } from 'react';
import { NodeProps } from 'reactflow';

import "./nodes.css"
import { CommandResult } from "../models";
import GenericNode from './GenericNode';
import { NodeData } from "./NodeData";

export class CommandResultNodeData extends NodeData {
    commandResult: CommandResult

    constructor(commandResult: CommandResult) {
        super();
        this.commandResult = commandResult
    }
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
