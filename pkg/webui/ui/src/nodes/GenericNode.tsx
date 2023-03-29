
import React, { CSSProperties, memo, useCallback, useContext } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { Box, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import "./nodes.css"
import { NODE_HANDLE_SIZE, NODE_HEIGHT, NODE_WIDTH } from '../constants';
import { SxProps } from '@mui/material/styles';
import { NodeData } from './NodeData';
import { NodeStatus } from './NodeStatus';
import { CommandResultFlowContext } from '../CommandResultFlowContext';

const ICON_STYLE: SxProps = {
    width: NODE_HANDLE_SIZE,
    height: NODE_HANDLE_SIZE,
    position: "absolute",
    right: -NODE_HANDLE_SIZE / 2,
    bottom: 'auto',
    color: 'blue',
    cursor: 'pointer'
}

const HANDLE_STYLE: CSSProperties = {
    bottom: 'auto',
    background: '#ccc',
    width: NODE_HANDLE_SIZE,
    height: NODE_HANDLE_SIZE,
    borderRadius: NODE_HANDLE_SIZE
}

export interface GenericNodeProps {
    header?: React.ReactNode;
    body?: React.ReactNode;
    leftHandleId?: string;
    rightHandleIds?: string[];
    nodeProps: NodeProps<NodeData>;
}

export default memo((props: GenericNodeProps) => {
    const { header, body, leftHandleId, rightHandleIds, nodeProps } = props;
    const handlesGap = rightHandleIds ? Math.floor(NODE_HEIGHT / (rightHandleIds.length + 1)) : 0;

    const {
        onHandleCollapse,
        nodesWithCollapsedHandles
    } = useContext(CommandResultFlowContext)

    const onHandleClick = useCallback((handleId: string, collapse: boolean) => (event: React.MouseEvent) => {
        event.stopPropagation();
        onHandleCollapse(nodeProps.id, handleId, collapse);
    }, [nodeProps.id, onHandleCollapse])

    return (
        <Box
            display="flex"
            flexDirection="column"
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            padding={`12px ${NODE_HANDLE_SIZE}px`}
            textAlign="left"
        >
            <Typography variant="h6" component="div" flex="0 0 auto">
                {nodeProps.id}: {header}
            </Typography>
            <Typography variant="body1" color="text.secondary" flex="1 1 auto" overflow="hidden">
                {body}
            </Typography>

            {nodeProps.data.diffStatus &&
                <Box display="flex" flexDirection="column" flex="0 0 auto">
                    <NodeStatus
                        diffStatus={nodeProps.data.diffStatus}
                        healthStatus={nodeProps.data.healthStatus}
                    />
                </Box>
            }

            {leftHandleId && <Handle
                type="target"
                position={Position.Left}
                id={leftHandleId}
                style={{
                    ...HANDLE_STYLE, left: -NODE_HANDLE_SIZE / 2
                }}
                isConnectable={false}
            />}

            {rightHandleIds && rightHandleIds.map((id, index) =>
                <div key={id}>
                    <Handle
                        type="source"
                        position={Position.Right}
                        id={id}
                        style={{
                            ...HANDLE_STYLE,
                            top: handlesGap * (index + 1) - NODE_HANDLE_SIZE / 2,
                            right: -NODE_HANDLE_SIZE / 2
                        }}
                        isConnectable={false}
                    />
                    {nodesWithCollapsedHandles.get(nodeProps.id)?.has(id)
                        ? <AddCircleIcon
                            sx={{
                                ...ICON_STYLE,
                                top: handlesGap * (index + 1) - NODE_HANDLE_SIZE / 2,
                            }}
                            onClick={onHandleClick(id, false)}
                        />
                        : <RemoveCircleIcon
                            sx={{
                                ...ICON_STYLE,
                                top: handlesGap * (index + 1) - NODE_HANDLE_SIZE / 2,
                            }}
                            onClick={onHandleClick(id, true)}
                        />
                    }

                </div>
            )}
        </Box>
    );
});
