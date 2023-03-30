import { timer } from "d3-timer";
import * as dagre from "dagre";
import { Edge, Node, Position, ReactFlowInstance } from 'reactflow';
import { NODE_HEIGHT, NODE_WIDTH } from "../constants";
import { NodeData } from "./NodeData";

export const layoutNodes = (nodes: Node<NodeData>[], edges: Edge[], immediate: boolean) => {
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
        const newPosition = {
            x: nodeWithPosition.x - NODE_WIDTH / 2,
            y: nodeWithPosition.y - NODE_HEIGHT / 2,
        };

        if (immediate) {
            node.position = newPosition
            node.data.targetPosition = undefined
        } else {
            if (node.position === newPosition) {
                node.data.targetPosition = undefined
            } else {
                node.data.targetPosition = newPosition
            }
        }
    });
}

function makeDagreGraph(nodes: Node<NodeData>[], edges: Edge[]): dagre.graphlib.Graph<any> {
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

export function runLayoutTransition(
    flow: ReactFlowInstance<NodeData>,
    duration: number,
    followNodeId?: string
): void {
    const t = timer((elapsed) => {
        if (elapsed > duration) {
            t.stop();
        }
        const progress = Math.min(elapsed / duration, 1);

        const nodes = flow.getNodes()

        nodes.forEach((node) => {
            if (node.data.targetPosition === undefined) {
                return
            }
            const oldPosition = node.position
            node.position = {
                x: interpolate(node.position.x, node.data.targetPosition.x, progress),
                y: interpolate(node.position.y, node.data.targetPosition.y, progress)
            }
            if (node.position === node.data.targetPosition) {
                node.data.targetPosition = undefined
            }

            if (node.id === followNodeId) {
                const delta = {
                    x: oldPosition.x - node.position.x,
                    y: oldPosition.y - node.position.y,
                }
                const newViewport = {
                    x: flow.getViewport().x + delta.x * flow.getZoom(),
                    y: flow.getViewport().y + delta.y * flow.getZoom(),
                    zoom: flow.getViewport().zoom
                }
                flow.setViewport(newViewport)
            }
        });

        flow.setNodes(nodes)
    });
}

function interpolate(a: number, b: number, progress: number): number {
    return a + (b - a) * progress;
}
