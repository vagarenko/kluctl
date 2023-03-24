import React, { memo } from 'react';
import { NodeProps } from 'reactflow';

import "./nodes.css"
import { CommandResult, DeploymentProjectConfig } from "../models";
import GenericNode from './GenericNode';

export type DeploymentProjectNodeData = {
    commandResult: CommandResult
    deploymentProject: DeploymentProjectConfig
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
