import { memo } from 'react';
import { NodeProps } from 'reactflow';

import "./nodes.css"
import { CommandResult, VarsSource } from "../models";
import GenericNode from './GenericNode';

export type VarsSourceNodeData = {
    commandResult: CommandResult
    varsSource: VarsSource
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
