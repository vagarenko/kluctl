import {addEdge, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState} from "reactflow";
import {useCallback, useEffect} from "react";
import {buildCommandResultNode} from "./nodes/buildNodes";
import {CommandResult} from "./models";

import testResult from './test-result.json';
import {layoutNodes} from "./nodes/layout";

const connectionLineStyle = {stroke: '#fff'};
const defaultViewport = {x: 0, y: 0, zoom: 1.5};
const initBgColor = '#1A192B';

const CommandResultFlow = () => {
    let commandResult = new CommandResult(testResult)

    const [initialNodes, initialEdges, nodeTypes] = buildCommandResultNode(commandResult)

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    layoutNodes(nodes, edges)

    useEffect(() => {
        setNodes(nodes);
        setEdges(edges);
    }, []);

    const onConnect = useCallback(
        (params: any) =>
            setEdges((eds) => addEdge({...params, animated: true, style: {stroke: '#fff'}}, eds)),
        []
    );
    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            style={{background: initBgColor}}
            nodeTypes={nodeTypes}
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