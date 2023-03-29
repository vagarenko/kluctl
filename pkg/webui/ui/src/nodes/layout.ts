import { timer } from "d3-timer";
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

export function calcLayout(nodes: Node<any>[], edges: Edge[]): Layout {
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

export type Layout = Record<string, XYPosition>

export function getCurrentLayout(nodes: Node[]): Layout {
    return nodes.reduce((acc, { id, position }) => {
        return {
            ...acc,
            [id]: position
        }
    }, {});
}

export function runLayoutTransition(
    nodes: Node[],
    currentLayout: Layout,
    targetLayout: Layout,
    duration: number,
    updateNodesCallback: (nodes: Node[]) => void
): void {
    const t = timer((elapsed) => {
        if (elapsed > duration) {
            t.stop();
        }
        const progress = Math.min(elapsed / duration, 1);

        nodes.forEach((node) => {
            if (!currentLayout[node.id] || !targetLayout[node.id]) {
                return;
            }
            node.position = {
                x: interpolate(currentLayout[node.id].x, targetLayout[node.id].x, progress),
                y: interpolate(currentLayout[node.id].y, targetLayout[node.id].y, progress)
            }
        });
        updateNodesCallback(nodes);
    });
}

function interpolate(a: number, b: number, progress: number): number {
    return a + (b - a) * progress;
}
