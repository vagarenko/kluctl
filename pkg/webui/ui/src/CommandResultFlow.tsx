import { addEdge, Connection, Controls, Edge, getConnectedEdges, getOutgoers, MiniMap, NodeChange, NodeMouseHandler, NodeSelectionChange, ReactFlow, ReactFlowInstance, useEdgesState, useNodesState } from "reactflow";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Node } from "reactflow";
import { calcLayout, getCurrentLayout, layoutNodes, runLayoutTransition } from "./nodes/layout";
import { getResult } from "./api";
import { SidePanel } from "./SidePanel";
import { NodeBuilder, NodeType, nodeTypes } from "./nodes/NodeBuilder";
import { NodeData } from "./nodes/NodeData";
import { Box } from "@mui/material";
import { TopBar } from "./TopBar/TopBar";
import { NodeStatusField } from "./nodes/NodeStatus";
import { CommandResultFlowContext } from "./CommandResultFlowContext";
import { EXPAND_COLLAPSE_TRANSITION_DURATION } from "./constants";

const connectionLineStyle = { stroke: '#fff' };
const defaultViewport = { x: 0, y: 0, zoom: 1 };
const initBgColor = '#1A192B';

export type CommandResultFlowProps = {
    resultId: string;
}

const CommandResultFlow = (props: CommandResultFlowProps) => {
    const [flow, setFlow] = useState<ReactFlowInstance | null>(null);
    const onInit = useCallback((f: ReactFlowInstance) => {
        setFlow(f)
    }, [])

    const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        getResult(props.resultId)
            .then(commandResult => {
                const builder = new NodeBuilder(commandResult)
                const [newNodes, newEdges] = builder.buildRoot()

                layoutNodes(newNodes, newEdges);

                setNodes(newNodes);
                setEdges(newEdges);
            })
    }, [props.resultId, setEdges, setNodes]);

    const onConnect = useCallback(
        (params: Connection) =>
            setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#fff' } }, eds)),
        [setEdges]
    );

    const [sidePanelNode, setSidePanelNode] = useState<Node<NodeData, NodeType> | null>(null);
    const onSidePanelClose = useCallback(() => {
        setSidePanelNode(null);
    }, []);

    const handleNodesChange = useCallback((nodeChanges: NodeChange[]) => {
        const selectChanges = nodeChanges.filter((change) => change.type === 'select') as NodeSelectionChange[];
        if (selectChanges.length === 1 && selectChanges[0].selected === false) {
            setSidePanelNode(null);
        }

        onNodesChange(nodeChanges);
    }, [onNodesChange]);

    const onNodeClick = useCallback((e: React.MouseEvent, node: Node<NodeData, NodeType>) => {
        setSidePanelNode(node);
    }, []);

    const [activeFilters, setActiveFilters] = useState<Set<NodeStatusField>>(new Set());
    const [nodesHiddenByFilters, setNodesHiddenByFilters] = useState<Set<string>>(new Set());
    const onFilterChange = useCallback((filters: Set<NodeStatusField>) => {
        if (!flow) { return; }

        setActiveFilters(filters);
        console.log(filters);

        if (filters.size === 0) {
            setNodesHiddenByFilters(new Set());
        } else {
            setNodesHiddenByFilters(
                new Set(
                    flow.getNodes().filter(node => !filterNode(node, filters))
                        .map(node => node.id)
                )
            );
        }
    }, [flow]);

    const [nodesWithCollapsedHandles, setNodesWithCollapsedHandles] = useState<Map<string, Set<string>>>(new Map());
    const [nodesHiddenByCollapsing, setNodesHiddenByCollapsing] = useState<Set<string>>(new Set());
    const onHandleCollapse = useCallback((nodeId: string, handleId: string, collapse: boolean) => {
        if (!flow) {
            return;
        }

        setNodesWithCollapsedHandles(prev => {
            const newState = new Map(prev);
            let collapsedHandles = newState.get(nodeId);
            if (!collapsedHandles) {
                collapsedHandles = new Set();
                newState.set(nodeId, collapsedHandles);
            }

            if (collapse) {
                collapsedHandles.add(handleId);
            } else {
                collapsedHandles.delete(handleId);
                if (collapsedHandles.size === 0) {
                    newState.delete(nodeId);
                }
            }

            return newState;
        });

        setNodesHiddenByCollapsing(prev => {
            const newState = new Set(prev);
            const children = getChildrenNodesFromHandle(
                flow.getNode(nodeId)!,
                handleId,
                flow.getNodes(),
                flow.getEdges()
            );
            if (collapse) {
                children.forEach(({ id }) => newState.add(id));
            } else {
                children.forEach(({ id }) => newState.delete(id));
            }

            return newState;
        });

    }, [flow]);

    useEffect(() => {
        if (!flow) { return; }

        const nodes = flow.getNodes();
        const edges = flow.getEdges();

        const newNodes = nodes.map(node => {
            if (nodesHiddenByFilters.has(node.id) || nodesHiddenByCollapsing.has(node.id)) {
                node.hidden = true
            } else {
                node.hidden = false;
            }
            return node;
        });

        const newEdges = edges.map(edge => {
            if (nodesHiddenByFilters.has(edge.target) || nodesHiddenByCollapsing.has(edge.target)) {
                edge.hidden = true;
            } else {
                edge.hidden = false;
            }

            return edge;
        })

        const currentLayout = getCurrentLayout(nodes);
        const targetLayout = calcLayout(newNodes, newEdges);
        runLayoutTransition(
            nodes,
            currentLayout,
            targetLayout,
            EXPAND_COLLAPSE_TRANSITION_DURATION,
            (nodes) => flow.setNodes(nodes)
        );

        flow.setNodes(newNodes);
        flow.setEdges(newEdges);
    }, [nodesHiddenByFilters, nodesHiddenByCollapsing, flow]);

    const context = useMemo(() => ({
        onHandleCollapse,
        nodesWithCollapsedHandles
    }), [nodesWithCollapsedHandles, onHandleCollapse])

    return (
        <CommandResultFlowContext.Provider value={context}>
            <Box width="100%" height="100%" position="relative" display="flex" flexDirection="column">
                <TopBar activeFilters={activeFilters} onFilterChange={onFilterChange} />
                <Box width="100%" flex="1 1 auto" position="relative">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onInit={onInit}
                        onNodesChange={handleNodesChange}
                        onNodeClick={onNodeClick as NodeMouseHandler}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        style={{ background: initBgColor }}
                        nodeTypes={nodeTypes}
                        nodesConnectable={false}
                        connectionLineStyle={connectionLineStyle}
                        //snapToGrid={true}
                        //snapGrid={snapGrid}
                        defaultViewport={defaultViewport}
                        fitView
                        attributionPosition="bottom-left"
                    >
                        <MiniMap
                        /*nodeStrokeColor={(n) => {
                            if (n.type === 'input') return '#0041d0';
                            if (n.type === 'selectorNode') return bgColor;
                            if (n.type === 'output') return '#ff0072';
                        }}*/
                        /*nodeColor={(n) => {
                            //if (n.type === 'selectorNode') return bgColor;
                            return '#fff';
                        }}*/
                        />
                        <Controls />
                    </ReactFlow>
                    <SidePanel node={sidePanelNode} onClose={onSidePanelClose} />
                </Box>
            </Box>
        </CommandResultFlowContext.Provider>
    );
};

export function filterNode(
    node: Node<NodeData>,
    activeFilters: Set<NodeStatusField>
): boolean {
    if (activeFilters.size === 0) {
        return true;
    }
    return [
        activeFilters.has("newObjects") && node.data.diffStatus?.newObjects?.length! > 0,
        activeFilters.has("deletedObjects") && node.data.diffStatus?.deletedObjects?.length! > 0,
        activeFilters.has("changedObjects") && node.data.diffStatus?.changedObjects?.length! > 0,
        activeFilters.has("warnings") && node.data.healthStatus?.warnings?.length! > 0,
        activeFilters.has("errors") && node.data.healthStatus?.errors?.length! > 0,
    ].some(x => x)
}

export function getChildrenNodesFromHandle(
    node: Node<NodeData>,
    handleId: string,
    nodes: Node<NodeData>[],
    edges: Edge[]
): Node<NodeData>[] {
    const directChildren = getOutgoers(node, nodes, edges);

    const idsOfDirectChildrenFromHandle = new Set(
        getConnectedEdges([node], edges)
            .filter(({ source, sourceHandle }) =>
                source === node.id && sourceHandle === handleId
            ).map(({ target }) => target)
    );

    const directChildrenFromHandle = directChildren.filter(node =>
        idsOfDirectChildrenFromHandle.has(node.id)
    );

    return [
        ...directChildrenFromHandle,
        ...directChildrenFromHandle.flatMap(node => getChildrenNodes(node, nodes, edges))
    ];
}

export function getChildrenNodes(
    node: Node<NodeData>,
    nodes: Node<NodeData>[],
    edges: Edge[]
): Node<NodeData>[] {
    const directChildren = getOutgoers(node, nodes, edges);
    return [
        ...directChildren,
        ...directChildren.flatMap(node => getChildrenNodes(node, nodes, edges))
    ];
}

export default CommandResultFlow;
