import React, {memo} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';

import "./nodes.css"
import {CommandResult, DeploymentItemConfig} from "../models";

export type DeploymentItemNodeData = {
    commandResult: CommandResult
    deploymentItem: DeploymentItemConfig
}

export default memo((props: NodeProps<DeploymentItemNodeData>) => {
    return (
        <>
            <div>
                <strong>DeploymentItem</strong><br/>
                path: {props.data.deploymentItem.path}<br/>
                objectCount: {props.data.deploymentItem.renderedObjects?.length}<br/>
            </div>

            <Handle
                type="target"
                position={Position.Left}
                id="parent"
                style={{bottom: 10, top: 'auto', background: '#555'}}
                isConnectable={true}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="vars"
                style={{bottom: 10, top: 'auto', background: '#555'}}
                isConnectable={true}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="objects"
                style={{bottom: 0, top: 'auto', background: '#555'}}
                isConnectable={true}
            />
        </>
    );
});
