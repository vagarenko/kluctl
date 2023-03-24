import React, { memo } from 'react';
import { NodeProps } from 'reactflow';

import "./nodes.css"
import { CommandResult, DeploymentItemConfig } from "../models";
import GenericNode from './GenericNode';

export type DeploymentItemNodeData = {
    commandResult: CommandResult
    deploymentItem: DeploymentItemConfig
}

export default memo((props: NodeProps<DeploymentItemNodeData>) => {
    return (
        <GenericNode
            header="DeploymentItem"
            body={<>
                path: {props.data.deploymentItem.path}<br />
                objectCount: {props.data.deploymentItem.renderedObjects?.length}<br />
            </>}
            leftHandleId="parent"
            rightHandleIds={["vars", "objects"]}
            nodeProps={props}
        />
    );
});
