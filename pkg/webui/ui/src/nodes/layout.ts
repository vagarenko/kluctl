import * as dagre from "dagre";
import { Edge, Node, Position, XYPosition } from 'reactflow';
import { NODE_HEIGHT, NODE_WIDTH } from "../constants";

export const layoutNodes = (nodes: Node<any>[], edges: Edge[]) => {
    const dagreGraph = makeDagreGraph(nodes, edges);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        if (!nodeWithPosition) {
            return;
        }
        node.targetPosition = Position.Left;
        node.sourcePosition = Position.Right;

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - NODE_WIDTH / 2,
            y: nodeWithPosition.y - NODE_HEIGHT / 2,
        };
    });
}

export function calcLayout(nodes: Node<any>[], edges: Edge[]): Record<string, XYPosition> {
    const dagreGraph = makeDagreGraph(nodes, edges);

    const res: Record<string, XYPosition> = {};
    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        if (!nodeWithPosition) {
            return;
        }

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        res[node.id] = {
            x: nodeWithPosition.x - NODE_WIDTH / 2,
            y: nodeWithPosition.y - NODE_HEIGHT / 2,
        };
    });

    return res;
}

function makeDagreGraph(nodes: Node<any>[], edges: Edge[]): dagre.graphlib.Graph<any> {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: "LR" });

    const visibleNodes = nodes.filter(({ hidden }) => !hidden);
    const visibleEdges = edges.filter(({ hidden }) => !hidden);

    visibleNodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    visibleEdges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return dagreGraph;
}
