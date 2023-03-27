import { Edge, Node } from 'reactflow';
import {
    ChangedObject,
    CommandResult,
    DeploymentError,
    DeploymentItemConfig,
    DeploymentProjectConfig,
    ObjectRef,
    VarsSource
} from "../models";
import CommandResultNode, { CommandResultNodeData } from "./CommandResultNode";
import DeploymentProjectNode, { DeploymentProjectNodeData } from "./DeploymentProjectNode";
import VarsSourceNode, { VarsSourceNodeData } from "./VarsSourceNode";
import DeploymentItemNode, { DeploymentItemNodeData } from "./DeploymentItemNode";
import ObjectNode, { ObjectNodeData } from "./ObjectNode";

export class DiffStatus  {
    newObjects: ObjectRef[] = [];
    removedObjects: ObjectRef[] = [];
    orphanObjects: ObjectRef[] = [];
    changedObjects: ChangedObject[] = [];

    totalInsertions: number = 0;
    totalDeletions: number = 0;
    totalUpdates: number = 0;

    set(newObjects: ObjectRef[],
        removedObjects: ObjectRef[],
        orphanObjects: ObjectRef[],
        changedObjects: ChangedObject[]) {
        this.newObjects = newObjects
        this.removedObjects = removedObjects
        this.orphanObjects = orphanObjects
        this.changedObjects = changedObjects

        changedObjects.forEach(c => {
            c.changes?.forEach(x => {
                switch (x.type) {
                    case "insert":
                        this.totalInsertions++
                        break
                    case "delete":
                        this.totalDeletions++
                        break
                    case "update":
                        this.totalUpdates++
                        break
                }
            })
        })
    }

    merge(other: DiffStatus) {
        this.newObjects = this.newObjects.concat(other.newObjects)
        this.removedObjects = this.removedObjects.concat(other.removedObjects)
        this.orphanObjects = this.orphanObjects.concat(other.orphanObjects)
        this.changedObjects = this.changedObjects.concat(other.changedObjects)

        this.totalInsertions += other.totalInsertions
        this.totalDeletions += other.totalDeletions
        this.totalUpdates += other.totalUpdates
    }
}

export class HealthStatus {
    errors: Map<string, DeploymentError> = new Map()
    warnings: Map<string, DeploymentError> = new Map()
}

export abstract class NodeData {
    healthStatus: HealthStatus = new HealthStatus();
    diffStatus: DiffStatus = new DiffStatus();
    collapsedHandles?: Set<string>;

    protected constructor() {
    }

    merge(other: NodeData) {
        this.diffStatus.merge(other.diffStatus)
    }
}


export const nodeTypes = {
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

export function buildCommandResultNode(commandResult: CommandResult): [Node<NodeData>[], Edge[]] {
    let nodes: Node<NodeData>[] = []
    let edges: Edge[] = []

    let rootNode: Node<CommandResultNodeData> = {
        id: genNextId().toString(),
        type: "commandResult",
        data: new CommandResultNodeData(commandResult),
        position,
    }
    nodes.push(rootNode)

    let child = buildDeploymentProjectNode(nodes, edges, commandResult, rootNode, commandResult.deployment!)
    rootNode.data.merge(child.data)

    return [nodes, edges]
}

function buildDeploymentProjectNode(nodes: Node<NodeData>[], edges: Edge[], commandResult: CommandResult, parentNode: Node<NodeData>, deploymentProjectConfig: DeploymentProjectConfig): Node<NodeData> {
    let node: Node<DeploymentProjectNodeData> = {
        id: genNextId(),
        type: "deploymentProject",
        data: new DeploymentProjectNodeData(commandResult, deploymentProjectConfig),
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
        let child = buildVarsSourceNode(nodes, edges, commandResult, node, varsSource)
        node.data.merge(child.data)
    })
    deploymentProjectConfig.deployments?.forEach(function (deploymentItem) {
        let child = buildDeploymentItemNode(nodes, edges, commandResult, node, deploymentItem)
        node.data.merge(child.data)
    })

    return node
}

function buildVarsSourceNode(nodes: Node<NodeData>[], edges: Edge[], commandResult: CommandResult, parentNode: Node<NodeData>, varsSource: VarsSource): Node<NodeData> {
    let node: Node<VarsSourceNodeData> = {
        id: genNextId(),
        type: "varsSource",
        data: new VarsSourceNodeData(commandResult, varsSource),
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

    return node
}

function buildDeploymentItemNode(nodes: Node<NodeData>[], edges: Edge[], commandResult: CommandResult, parentNode: Node<NodeData>, deploymentItem: DeploymentItemConfig): Node<NodeData> {
    let node: Node<DeploymentItemNodeData> = {
        id: genNextId(),
        type: "deploymentItem",
        data: new DeploymentItemNodeData(commandResult, deploymentItem),
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
        let child = buildDeploymentProjectNode(nodes, edges, commandResult, node, deploymentItem.renderedInclude)
        node.data.merge(child.data)
    }

    deploymentItem.vars?.forEach(function (varsSource) {
        let child = buildVarsSourceNode(nodes, edges, commandResult, node, varsSource)
        node.data.merge(child.data)
    })
    deploymentItem.renderedObjects?.forEach(function (renderedObject) {
        let child = buildObjectNode(nodes, edges, commandResult, node, renderedObject)
        node.data.merge(child.data)
    })

    return node
}

function buildObjectNode(nodes: Node<NodeData>[], edges: Edge[], commandResult: CommandResult, parentNode: Node<NodeData>, objectRef: ObjectRef): Node<NodeData> {
    let node: Node<ObjectNodeData> = {
        id: genNextId(),
        type: "object",
        data: new ObjectNodeData(commandResult, objectRef),
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

    return node
}
