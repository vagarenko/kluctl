import { Edge, Node } from 'reactflow';
import { CommandResult, DeploymentItemConfig, DeploymentProjectConfig, VarsSource } from "../models";
import CommandResultNode, { CommandResultNodeData } from "./CommandResultNode";
import DeploymentProjectNode, { DeploymentProjectNodeData } from "./DeploymentProjectNode";
import VarsSourceNode, { VarsSourceNodeData } from "./VarsSourceNode";
import DeploymentItemNode, { DeploymentItemNodeData } from "./DeploymentItemNode";
import ObjectNode, { ObjectNodeData } from "./ObjectNode";

export type NodeData =
    | CommandResultNodeData
    | DeploymentProjectNodeData
    | VarsSourceNodeData
    | DeploymentItemNodeData
    | ObjectNodeData


const nodeTypes = {
    commandResult: CommandResultNode,
    deploymentProject: DeploymentProjectNode,
    varsSource: VarsSourceNode,
    deploymentItem: DeploymentItemNode,
    object: ObjectNode,
};

const position = { x: 0, y: 0 };
const edgeType = 'default';

let nextId = 1

function genNextId(): string {
    let id = nextId
    nextId++
    return id.toString()
}

export function buildCommandResultNode(commandResult: CommandResult): [Node<NodeData>[], Edge[], any] {
    let nodes: Node<NodeData>[] = []
    let edges: Edge[] = []

    let rootNode: Node<CommandResultNodeData> = {
        id: genNextId().toString(),
        type: "commandResult",
        data: { commandResult: commandResult },
        position,
    }
    nodes.push(rootNode)

    buildDeploymentProjectNode(nodes, edges, commandResult, rootNode, commandResult.deployment!)

    return [nodes, edges, nodeTypes]
}

function buildDeploymentProjectNode(nodes: Node<NodeData>[], edges: Edge[], commandResult: CommandResult, parentNode: Node<NodeData>, deploymentProjectConfig: DeploymentProjectConfig) {
    let node: Node<DeploymentProjectNodeData> = {
        id: genNextId(),
        type: "deploymentProject",
        data: { commandResult: commandResult, deploymentProject: deploymentProjectConfig },
        position
    }

    nodes.push(node)
    edges.push({
        id: genNextId(),
        type: edgeType,
        source: parentNode.id,
        target: node.id,
        sourceHandle: "deployments"
    })

    deploymentProjectConfig.vars?.forEach(function (varsSource) {
        buildVarsSourceNode(nodes, edges, commandResult, node, varsSource)
    })
    deploymentProjectConfig.deployments?.forEach(function (deploymentItem) {
        buildDeploymentItemNode(nodes, edges, commandResult, node, deploymentItem)
    })
}

function buildVarsSourceNode(nodes: Node<NodeData>[], edges: Edge[], commandResult: CommandResult, parentNode: Node<NodeData>, varsSource: VarsSource) {
    let node: Node<VarsSourceNodeData> = {
        id: genNextId(),
        type: "varsSource",
        data: { commandResult: commandResult, varsSource: varsSource },
        position
    }

    nodes.push(node)
    edges.push({
        id: genNextId(),
        type: edgeType,
        source: parentNode.id,
        target: node.id,
        sourceHandle: "vars",
    })
}

function buildDeploymentItemNode(nodes: Node<NodeData>[], edges: Edge[], commandResult: CommandResult, parentNode: Node<NodeData>, deploymentItem: DeploymentItemConfig) {
    let node: Node<DeploymentItemNodeData> = {
        id: genNextId(),
        type: "deploymentItem",
        data: { commandResult: commandResult, deploymentItem: deploymentItem },
        position
    }

    nodes.push(node)
    edges.push({
        id: genNextId(),
        type: edgeType,
        source: parentNode.id,
        target: node.id,
        sourceHandle: "deployments",
    })

    if (deploymentItem.renderedInclude !== undefined) {
        buildDeploymentProjectNode(nodes, edges, commandResult, node, deploymentItem.renderedInclude)
    }

    deploymentItem.vars?.forEach(function (varsSource) {
        buildVarsSourceNode(nodes, edges, commandResult, node, varsSource)
    })
    deploymentItem.renderedObjects?.forEach(function (renderedObject) {
        buildObjectNode(nodes, edges, commandResult, node, renderedObject)
    })
}

function buildObjectNode(nodes: Node<NodeData>[], edges: Edge[], commandResult: CommandResult, parentNode: Node<NodeData>, renderedObject: any) {
    let node: Node<ObjectNodeData> = {
        id: genNextId(),
        type: "object",
        data: { commandResult: commandResult, renderedObject: renderedObject },
        position
    }

    nodes.push(node)
    edges.push({
        id: genNextId(),
        type: edgeType,
        source: parentNode.id,
        target: node.id,
        sourceHandle: "deployments",
    })
}
