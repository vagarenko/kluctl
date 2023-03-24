import React, { memo } from 'react';
import { NodeProps } from 'reactflow';

import "./nodes.css"
import { CommandResult } from "../models";
import GenericNode from './GenericNode';

export type ObjectNodeData = {
    commandResult: CommandResult
    renderedObject: any
}

export default memo((props: NodeProps<ObjectNodeData>) => {
    return (
        <GenericNode
            header="Object"
            body={<>
                apiVersion: {props.data.renderedObject.object.apiVersion}<br />
                kind: {props.data.renderedObject.object.kind}<br />
                name: {props.data.renderedObject.object.metadata.name}<br />
                namespace: {props.data.renderedObject.object.metadata.namespace!}<br />
            </>}
            leftHandleId="parent"
            nodeProps={props}
        />
    );
});
