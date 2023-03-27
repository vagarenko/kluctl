import React, { memo } from 'react';
import { NodeProps } from 'reactflow';

import "./nodes.css"
import { CommandResult, DeploymentProjectConfig } from "../models";
import GenericNode from './GenericNode';
import { NodeData } from "./buildNodes";

export class DeploymentProjectNodeData extends NodeData {
    commandResult: CommandResult
    deploymentProject: DeploymentProjectConfig

    constructor(commandResult: CommandResult, deploymentProject: DeploymentProjectConfig) {
        super();
        this.commandResult = commandResult
        this.deploymentProject = deploymentProject
    }

}

export default memo((props: NodeProps<DeploymentProjectNodeData>) => {
    return (
        <GenericNode
            header="DeploymentProject"
            body={<>
                tags: {props.data.deploymentProject.tags}<br />
            </>}
            leftHandleId="parent"
            rightHandleIds={["vars", "deployments"]}
            nodeProps={props}
        />
    );
});
