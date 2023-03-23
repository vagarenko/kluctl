import React, {memo} from 'react';
import {Handle, NodeProps, Position} from 'reactflow';

import "./nodes.css"
import {CommandResult} from "../models";

export type ObjectNodeData = {
    commandResult: CommandResult
    renderedObject: any
}

export default memo((props: NodeProps<ObjectNodeData>) => {
    return (
        <>
            <div>
                <strong>Object</strong><br/>
                apiVersion: {props.data.renderedObject.object.apiVersion}<br/>
                kind: {props.data.renderedObject.object.kind}<br/>
                name: {props.data.renderedObject.object.metadata.name}<br/>
                namespace: {props.data.renderedObject.object.metadata.namespace!}<br/>
            </div>

            <Handle
                type="target"
                position={Position.Left}
                id="parent"
                style={{bottom: 10, top: 'auto', background: '#555'}}
                isConnectable={true}
            />
        </>
    );
});
