import { addEdge, Connection, Controls, MiniMap, NodeChange, NodeMouseHandler, NodeSelectionChange, ReactFlow, useEdgesState, useNodesState } from "reactflow";
import { useCallback, useEffect, useState } from "react";
import { Node } from "reactflow";
import { layoutNodes } from "./nodes/layout";
import { getResult } from "./api";
import { SidePanel } from "./SidePanel";
import { NodeBuilder, NodeType, nodeTypes } from "./nodes/NodeBuilder";
import { NodeData } from "./nodes/NodeData";

const connectionLineStyle = { stroke: '#fff' };
const defaultViewport = { x: 0, y: 0, zoom: 1 };
const initBgColor = '#1A192B';

export type CommandResultFlowProps = {
    resultId: string
}

const CommandResultFlow = (props: CommandResultFlowProps) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        getResult(props.resultId)
            .then(commandResult => {
                const builder = new NodeBuilder(commandResult)
                const [newNodes, newEdges] = builder.buildRoot()

                layoutNodes(newNodes, newEdges);

                setNodes(newNodes)
                setEdges(newEdges)
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

    const onNodeClick  = useCallback((e: React.MouseEvent, node: Node<NodeData, NodeType>) => {
        setSidePanelNode(node);
    }, []);

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
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
        </div>
    );
};

export default CommandResultFlow;
