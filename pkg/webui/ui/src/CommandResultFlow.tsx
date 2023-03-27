import { addEdge, Connection, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState } from "reactflow";
import { useCallback, useEffect } from "react";
import { buildCommandResultNode, nodeTypes } from "./nodes/buildNodes";

import { layoutNodes } from "./nodes/layout";
import { getResult } from "./api";

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
                const [newNodes, newEdges] = buildCommandResultNode(commandResult)

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

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
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
            <Controls/>
        </ReactFlow>
    );
};

export default CommandResultFlow;
