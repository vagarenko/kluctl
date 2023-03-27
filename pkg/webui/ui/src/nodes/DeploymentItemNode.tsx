import React, { memo } from 'react';
import { NodeProps } from 'reactflow';

import "./nodes.css"
import { CommandResult, DeploymentItemConfig } from "../models";
import GenericNode from './GenericNode';
import { NodeData } from "./NodeData";

export class DeploymentItemNodeData extends NodeData {
    commandResult: CommandResult
    deploymentItem: DeploymentItemConfig

    constructor(commandResult: CommandResult, deploymentItem: DeploymentItemConfig) {
        super(true, true);
        this.commandResult = commandResult
        this.deploymentItem = deploymentItem
    }
}

export default memo((props: NodeProps<DeploymentItemNodeData>) => {
    return (
        <GenericNode
            header="DeploymentItem"
            body={<>
                path: {props.data.deploymentItem.path}<br />
            </>}
            leftHandleId="parent"
            rightHandleIds={["vars", "deployments"]}
            nodeProps={props}
        />
    );
});
