
import React, { memo, useCallback, useState } from 'react';
import { Handle, NodeProps, Position, useReactFlow, Node, Edge, getOutgoers, getConnectedEdges } from 'reactflow';
import { Typography } from '@mui/material';

import "./nodes.css"

export interface GenericNodeProps {
    header?: React.ReactNode;
    body?: React.ReactNode;
    leftHandleId?: string;
    rightHandleIds?: string[];
    nodeProps: NodeProps;
}

export default memo((props: GenericNodeProps) => {
    const { header, body, leftHandleId, rightHandleIds, nodeProps } = props;
    const handlesGap = rightHandleIds ? Math.floor(110 / (rightHandleIds.length + 1)) : 0;

    const flow = useReactFlow();
    const [collapsedHandles, setCollapsedHandles] = useState<Set<string>>(new Set());

    const onHandleClick = useCallback((handleId: string) => () => {
        console.log(nodeProps, handleId);
        let hidden: boolean;
        if (collapsedHandles.has(handleId)) {
            collapsedHandles.delete(handleId);
            hidden = false;
        } else {
            collapsedHandles.add(handleId);
            hidden = true;
        }
        console.log(collapsedHandles);
        setCollapsedHandles(new Set(collapsedHandles));

        const node = flow.getNode(nodeProps.id)!;
        const nodes = flow.getNodes();
        const edges = flow.getEdges();

        const [childrenNodes, childrenEdges] = getChildrenNodesAndEdgesFromHandle(node, handleId, nodes, edges);

        const childrenNodesIds = new Set(childrenNodes.map(({ id }) => id));
        const childrenEdgesIds = new Set(childrenEdges.map(({ id }) => id));

        const newEdges = edges.map(e => {
            if (childrenEdgesIds.has(e.id)) {
                return {
                    ...e,
                    hidden
                }
            }
            return e;
        });

        const newNodes = nodes.map(n => {
            if (childrenNodesIds.has(n.id)) {
                return {
                    ...n,
                    hidden
                }
            }
            return n;
        });

        flow.setNodes(newNodes);
        flow.setEdges(newEdges);
    }, [collapsedHandles, flow, nodeProps])

    return (
        <>
            <Typography gutterBottom variant="h5" component="div">
                {nodeProps.id}: {header}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                {body}
            </Typography>

            {leftHandleId && <Handle
                type="target"
                position={Position.Left}
                id={leftHandleId}
                style={{ background: '#555' }}
                isConnectable={false}
            />}

            {rightHandleIds && rightHandleIds.map((id, index) =>
                <Handle
                    key={id}
                    type="source"
                    position={Position.Right}
                    id={id}
                    style={{ bottom: 'auto', top: handlesGap * (index + 1) - 10, background: '#555' }}
                    isConnectable={false}
                    onClick={onHandleClick(id)}
                />
            )}
        </>
    );
});

function getChildrenNodesAndEdgesFromHandle<T>(
    node: Node<T>,
    handleId: string,
    nodes: Node<T>[],
    edges: Edge[]
): [Node<T>[], Edge[]] {
    const resultNodes: Node<T>[] = [];
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

function getEdgesToDirectChildrenFromHandle<T>(
    node: Node<T>,
    handleId: string,
    edges: Edge[]
): Edge[] {
    const connectedEdges = getConnectedEdges([node], edges);
    return connectedEdges
        .filter(({ source, sourceHandle }) =>
            source === node.id && sourceHandle === handleId
        );
}

function getChildrenNodesAndEdges<T>(
    node: Node<T>,
    nodes: Node<T>[],
    edges: Edge[]
): [Node<T>[], Edge[]] {
    const resultNodes: Node<T>[] = [];
    const resultEdges: Edge[] = [];

    const directChildren = getOutgoers(node, nodes, edges);
    const edgesToDirectChildren = getConnectedEdges([node], edges).filter(({ source }) => source === node.id);

    resultNodes.push(...directChildren);
    resultEdges.push(...edgesToDirectChildren);

    directChildren.forEach(n => {
        const [ns, es] = getChildrenNodesAndEdges(n, nodes, edges);
        resultNodes.push(...ns);
        resultEdges.push(...es);
    });

    return [resultNodes, resultEdges];
}
