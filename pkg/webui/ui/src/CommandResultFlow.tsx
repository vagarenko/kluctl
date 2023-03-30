import {
    Controls,
    Edge,
    getConnectedEdges,
    getOutgoers,
    MiniMap,
    NodeChange,
    NodeMouseHandler,
    NodeSelectionChange,
    Panel,
    ReactFlow,
    ReactFlowProvider, useReactFlow, useViewport
} from "reactflow";
import { useCallback, useEffect, useState } from "react";
import { Node } from "reactflow";
import { layoutNodes, runLayoutTransition } from "./nodes/layout";
import { getResult } from "./api";
import { SidePanel } from "./SidePanel";
import { NodeBuilder, NodeType, nodeTypes } from "./nodes/NodeBuilder";
import { NodeData } from "./nodes/NodeData";
import { Box } from "@mui/material";
import { TopBar } from "./TopBar/TopBar";
import { NodeStatusField } from "./nodes/NodeStatus";
import { CommandResultFlowContext, CommandResultFlowContextProps } from "./CommandResultFlowContext";
import { EXPAND_COLLAPSE_TRANSITION_DURATION } from "./constants";
import { updateHiddenNodes } from "./nodes/hide";

const connectionLineStyle = { stroke: '#fff' };
const initBgColor = '#888';

export type CommandResultFlowProps = {
    resultId: string;
}

const CommandResultFlow = (props: CommandResultFlowProps) => {
    const flow = useReactFlow();
    const viewport = useViewport()

    useEffect(() => {
        getResult(props.resultId)
            .then(commandResult => {
                const builder = new NodeBuilder(commandResult)
                const [newNodes, newEdges] = builder.buildRoot()

                layoutNodes(newNodes, newEdges, true);

                flow.setNodes(newNodes);
                flow.setEdges(newEdges);
            })
    }, [props.resultId, flow]);

    const [sidePanelNode, setSidePanelNode] = useState<Node<NodeData, NodeType> | null>(null);
    const onSidePanelClose = useCallback(() => {
        setSidePanelNode(null);
    }, []);

    const handleNodesChange = useCallback((nodeChanges: NodeChange[]) => {
        const selectChanges = nodeChanges.filter((change) => change.type === 'select') as NodeSelectionChange[];
        if (selectChanges.length === 1 && selectChanges[0].selected === false) {
            setSidePanelNode(null);
        }
    }, []);

    const onNodeClick = useCallback((e: React.MouseEvent, node: Node<NodeData, NodeType>) => {
        setSidePanelNode(node);
    }, []);

    const [activeFilters, setActiveFilters] = useState<Set<NodeStatusField>>(new Set());
    function onFilterChange(filters: Set<NodeStatusField>) {
        setActiveFilters(filters);
    }

    useEffect(() => {
        layoutCallback()
    }, [activeFilters])

    const layoutCallback = function(followNodeId?: string) {
        console.log("layoutCallback")

        const nodes = flow.getNodes()
        const edges = flow.getEdges()
        updateHiddenNodes(nodes, edges, activeFilters)
        layoutNodes(nodes, edges, false)
        flow.setNodes(nodes)
        flow.setEdges(edges)

        runLayoutTransition(flow, EXPAND_COLLAPSE_TRANSITION_DURATION, followNodeId)
    }

    const context: CommandResultFlowContextProps = {
        layoutCallback: layoutCallback,
    }

    return (
        <CommandResultFlowContext.Provider value={context}>
            <Box width="100%" height="100%" position="relative" display="flex" flexDirection="column">
                <TopBar activeFilters={activeFilters} onFilterChange={onFilterChange} />
                <Box width="100%" flex="1 1 auto" position="relative">
                    <ReactFlow
                        defaultNodes={[]}
                        defaultEdges={[]}
                        onNodesChange={handleNodesChange}
                        onNodeClick={onNodeClick as NodeMouseHandler}
                        style={{ background: initBgColor }}
                        nodeTypes={nodeTypes}
                        nodesConnectable={false}
                        connectionLineStyle={connectionLineStyle}
                        //snapToGrid={true}
                        //snapGrid={snapGrid}
                        defaultViewport={viewport}
                        fitView
                        attributionPosition="bottom-left"
                        panOnScroll={true}
                        minZoom={0.1}
                    >
                        <MiniMap nodeColor={"#f00"} zoomable pannable/>
                        <Panel position="top-right">x={viewport.x}, y={viewport.y}, zoom={viewport.zoom}</Panel>
                        <Controls />
                    </ReactFlow>
                    <SidePanel node={sidePanelNode} onClose={onSidePanelClose} />
                </Box>
            </Box>
        </CommandResultFlowContext.Provider>
    );
};

export function CommandResultFlowWithProvider(props: CommandResultFlowProps) {
    return (
        <ReactFlowProvider>
            <CommandResultFlow resultId={props.resultId}/>
        </ReactFlowProvider>
    );
}

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

export default CommandResultFlowWithProvider;
