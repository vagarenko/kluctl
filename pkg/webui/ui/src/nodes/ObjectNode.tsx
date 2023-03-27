import React, { memo } from 'react';
import { NodeProps } from 'reactflow';

import "./nodes.css"
import {CommandResult, ObjectRef} from "../models";
import GenericNode from './GenericNode';

export type ObjectNodeData = {
    commandResult: CommandResult
    objectRef: ObjectRef
}

export default memo((props: NodeProps<ObjectNodeData>) => {
    return (
        <GenericNode
            header="Object"
            body={<>
                group: {props.data.objectRef.group}<br />
                version: {props.data.objectRef.version}<br />
                kind: {props.data.objectRef.kind}<br />
                name: {props.data.objectRef.name}<br />
                namespace: {props.data.objectRef.namespace!}<br />
            </>}
            leftHandleId="parent"
            nodeProps={props}
        />
    );
});
