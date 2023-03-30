import { NodeData } from "./NodeData";
import { Edge, Node } from 'reactflow';
import { NodeStatusField } from "./NodeStatus";
import { filterNode } from "../CommandResultFlow";

export function updateHiddenNodes(nodes: Node<NodeData>[], edges: Edge[], filters: Set<NodeStatusField>) {
    const sourceEdgeMap = new Map<string, Edge[]>()
    const targetEdgeMap = new Map<string, Edge>()
    edges.forEach(edge => {
        let l = sourceEdgeMap.get(edge.source)
        if (l === undefined) {
            l = []
            sourceEdgeMap.set(edge.source, l)
        }
        l.push(edge)

        targetEdgeMap.set(edge.target, edge)
    })

    const nodeMap = new Map(nodes.map(node => [node.id, node]))

    function doCollapse(node: Node<NodeData>) {
        const l = sourceEdgeMap.get(node.id)
        if (l === undefined) {
            return
        }

        l.forEach(edge => {
            const collapsed = node.data.collapsedHandles.indexOf(edge.sourceHandle!) !== -1

            const targetNode = nodeMap.get(edge.target)
            if (targetNode === undefined) {
                return
            }

            const filtered = !filterNode(targetNode, filters)

            targetNode.hidden = node.hidden || collapsed || filtered
            edge.hidden = targetNode.hidden

            console.log("node: " + node.id + ", edge: " + edge.id + ", targetNode: " + targetNode.id + ", filtered=" + filtered + ", hidden=" + targetNode.hidden)

            doCollapse(targetNode)
        })
    }

    nodes.forEach(node => {
        if (targetEdgeMap.has(node.id)) {
            // not a root node
            return
        }
        doCollapse(node)
    })
}
