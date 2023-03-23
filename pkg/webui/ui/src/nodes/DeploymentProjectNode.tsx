import React, { memo } from 'react';
import {Handle, NodeProps, Position} from 'reactflow';

import "./nodes.css"
import {CommandResult, DeploymentProjectConfig} from "../models";

export type DeploymentProjectNodeData = {
    commandResult: CommandResult
    deploymentProject: DeploymentProjectConfig
}

export default memo((props: NodeProps<DeploymentProjectNodeData>) => {
    return (
        <>
            <div>
                <strong>DeploymentProject</strong><br/>
                tags: {props.data.deploymentProject.tags}<br/>
            </div>

            <Handle
                type="target"
                position={Position.Left}
                id="parent"
                style={{ bottom: 10, top: 'auto', background: '#555' }}
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
                id="deployments"
                style={{ bottom: 0, top: 'auto', background: '#555' }}
                isConnectable={true}
            />
        </>
    );
});
