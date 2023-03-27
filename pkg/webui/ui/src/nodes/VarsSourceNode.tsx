import { memo } from 'react';
import { NodeProps } from 'reactflow';

import "./nodes.css"
import { CommandResult, VarsSource } from "../models";
import GenericNode from './GenericNode';
import { NodeData } from "./NodeData";

export class VarsSourceNodeData extends NodeData {
    commandResult: CommandResult
    varsSource: VarsSource

    constructor(commandResult: CommandResult, varsSource: VarsSource) {
        super(false, false);
        this.commandResult = commandResult
        this.varsSource = varsSource
    }
}

export default memo((props: NodeProps<VarsSourceNodeData>) => {
    return (
        <GenericNode
            header="VarsSource"
            body={<>
                varsCount: {Object.keys(props.data.varsSource.renderedVars?.object).length}
            </>}
            leftHandleId="parent"
            nodeProps={props}
        />
    );
});
