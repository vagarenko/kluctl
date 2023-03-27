
import React, { CSSProperties, memo, useCallback } from 'react';
import { Handle, NodeProps, Position, useReactFlow, Node, Edge, getConnectedEdges, XYPosition } from 'reactflow';
import { Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import "./nodes.css"
import { calcLayout } from './layout';
import { timer } from 'd3-timer';
import { EXPAND_COLLAPSE_TRANSITION_DURATION, NODE_HANDLE_SIZE, NODE_HEIGHT } from '../constants';
import { SxProps } from '@mui/material/styles';
import { NodeData } from './NodeData';

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
    const { data } = nodeProps;
    const handlesGap = rightHandleIds ? Math.floor(NODE_HEIGHT / (rightHandleIds.length + 1)) : 0;
    const flow = useReactFlow();

    const onHandleClick = useCallback((handleId: string, collapse: boolean) => (event: React.MouseEvent) => {
        event.stopPropagation();

        const node = flow.getNode(nodeProps.id)!;

        const collapsedHandles = new Set(node.data.collapsedHandles);
        if (collapse) {
            collapsedHandles.add(handleId);
        } else {
            collapsedHandles.delete(handleId);
        }

        const nodes = [
            ...flow.getNodes().filter(({ id }) => id !== nodeProps.id),
            {
                ...node,
                data: {
                    ...data,
                    collapsedHandles
                }
            }
        ];
        const edges = flow.getEdges();

        const [childrenNodes, childrenEdges] = getChildrenNodesAndEdgesFromHandle(node, handleId, nodes, edges);

        const childrenNodesIds = new Set(childrenNodes.map(({ id }) => id));
        const childrenEdgesIds = new Set(childrenEdges.map(({ id }) => id));

        const newEdges = edges.map(e => {
            if (childrenEdgesIds.has(e.id)) {
                e.hidden = collapse;
            }
            return e;
        });

        const newNodes = nodes.map(n => {
            if (childrenNodesIds.has(n.id)) {
                n.hidden = collapse
            }
            return n;
        });

        const currentLayout: Record<string, XYPosition> = nodes.reduce((acc, { id, position }) => {
            return {
                ...acc,
                [id]: position
            }
        }, {});
        const targetLayout = calcLayout(newNodes, newEdges);

        const t = timer((elapsed) => {
            if (elapsed > EXPAND_COLLAPSE_TRANSITION_DURATION) {
                t.stop();
            }
            const progress = Math.min(elapsed / EXPAND_COLLAPSE_TRANSITION_DURATION, 1);

            newNodes.forEach((node) => {
                if (!currentLayout[node.id] || !targetLayout[node.id]) {
                    return;
                }
                node.position = {
                    x: interpolate(currentLayout[node.id].x, targetLayout[node.id].x, progress),
                    y: interpolate(currentLayout[node.id].y, targetLayout[node.id].y, progress)
                }
            });
            flow.setNodes(newNodes);
        });

        flow.setNodes(newNodes);
        flow.setEdges(newEdges);
    }, [data, flow, nodeProps.id])

    return (
        <>
            <Typography gutterBottom variant="h6" component="div">
                {nodeProps.id}: {header}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                {body}
            </Typography>
            {nodeProps.data.diffStatus &&
                <>
                    new/deleted: {nodeProps.data.diffStatus.newObjects.length}/{nodeProps.data.diffStatus.deletedObjects.length}<br/>
                    changes: -{nodeProps.data.diffStatus.totalDeletions},+{nodeProps.data.diffStatus.totalInsertions},±{nodeProps.data.diffStatus.totalUpdates}
                </>
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
                    {data.collapsedHandles?.has(id)
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
        </>
    );
});

function getChildrenNodesAndEdgesFromHandle(
    node: Node<NodeData>,
    handleId: string,
    nodes: Node<NodeData>[],
    edges: Edge[]
): [Node<NodeData>[], Edge[]] {
    const resultNodes: Node<NodeData>[] = [];
    const resultEdges: Edge[] = [];

    const edgesToDirectChildren = getEdgesToDirectChildrenFromHandle(node, handleId, edges)

    const directChildrenIds = new Set<string>();
    edgesToDirectChildren.forEach(({ target }) => directChildrenIds.add(target));
    const directChildren = nodes.filter(({ id }) => directChildrenIds.has(id));

    resultEdges.push(...edgesToDirectChildren);
    resultNodes.push(...directChildren);

    directChildren.forEach((node) => {
        const [ns, es] = getChildrenNodesAndEdges(node, nodes, edges);
        resultNodes.push(...ns);
        resultEdges.push(...es);
    });

    return [resultNodes, resultEdges]
}

function getEdgesToDirectChildrenFromHandle(
    node: Node<NodeData>,
    handleId: string,
    edges: Edge[]
): Edge[] {
    const connectedEdges = getConnectedEdges([node], edges);
    return connectedEdges
        .filter(({ source, sourceHandle }) =>
            source === node.id && sourceHandle === handleId
        );
}

function getChildrenNodesAndEdges(
    node: Node<NodeData>,
    nodes: Node<NodeData>[],
    edges: Edge[]
): [Node<NodeData>[], Edge[]] {
    const resultNodes: Node<NodeData>[] = [];
    const resultEdges: Edge[] = [];

    const edgesToDirectChildren = getConnectedEdges([node], edges)
        .filter(({ source, sourceHandle }) => {
            if (sourceHandle && node.data.collapsedHandles) {
                return source === node.id && !node.data.collapsedHandles.has(sourceHandle);
            }
            return source === node.id;
        });
    const directChildrenIds = new Set(edgesToDirectChildren.map(({ target }) => target))
    const directChildren = nodes.filter(({ id }) => directChildrenIds.has(id))

    resultNodes.push(...directChildren);
    resultEdges.push(...edgesToDirectChildren);

    directChildren.forEach(n => {
        const [ns, es] = getChildrenNodesAndEdges(n, nodes, edges);
        resultNodes.push(...ns);
        resultEdges.push(...es);
    });

    return [resultNodes, resultEdges];
}

function interpolate(a: number, b: number, progress: number): number {
    return a + (b - a) * progress;
}
