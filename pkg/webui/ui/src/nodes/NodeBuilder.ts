import { Edge, Node } from 'reactflow';
import {
    ChangedObject,
    CommandResult,
    DeploymentError,
    DeploymentItemConfig,
    DeploymentProjectConfig,
    ObjectRef, UnstructuredObject,
    VarsSource
} from "../models";
import CommandResultNode, { CommandResultNodeData } from "./CommandResultNode";
import DeploymentProjectNode, { DeploymentProjectNodeData } from "./DeploymentProjectNode";
import VarsSourceNode, { VarsSourceNodeData } from "./VarsSourceNode";
import DeploymentItemNode, { DeploymentItemNodeData } from "./DeploymentItemNode";
import ObjectNode, { ObjectNodeData } from "./ObjectNode";
import { NodeData } from "./NodeData";

export const nodeTypes = {
    commandResult: CommandResultNode,
    deploymentProject: DeploymentProjectNode,
    varsSource: VarsSourceNode,
    deploymentItem: DeploymentItemNode,
    object: ObjectNode,
};

const position = { x: 0, y: 0 };
const edgeType = 'default';

export class NodeBuilder {
    private commandResult: CommandResult
    private newObjectsMap: {[key:string]:UnstructuredObject} = {}
    private changedObjectsMap: {[key:string]:ChangedObject} = {}

    private nodes: Node<NodeData>[] = []
    private edges: Edge[] = []

    constructor(commandResult: CommandResult) {
        this.commandResult = commandResult

        commandResult.newObjects?.forEach(no => {
            let ref = buildObjectRefFromObject(no)
            this.newObjectsMap[buildObjectRefKey(ref)] = no
        })
        commandResult.changedObjects?.forEach(co => {
            this.changedObjectsMap[buildObjectRefKey(co.ref)] = co
        })
    }

    nextId: number = 1
    genNextId(): string {
        let id = this.nextId
        this.nextId++
        return id.toString()
    }

    buildNode<T extends NodeData>(type: string, data: T): Node<T> {
        let node: Node<T> = {
            id: this.genNextId().toString(),
            type: type,
            data: data,
            position,
        }
        this.nodes.push(node)
        return node
    }

    buildEdge(source: Node, target: Node, sourceHandle: string, targetHandle?: string) {
        this.edges.push({
            id: this.genNextId(),
            type: edgeType,
            source: source.id,
            target: target.id,
            sourceHandle: sourceHandle,
            targetHandle: targetHandle,
        })
    }

    buildRoot(): [Node<NodeData>[], Edge[]] {
        let rootNode = this.buildNode("commandResult", new CommandResultNodeData(this.commandResult))

        let child = this.buildDeploymentProjectNode(rootNode, this.commandResult.deployment!)
        rootNode.data.merge(child.data)

        return [this.nodes, this.edges]
    }

    buildDeploymentProjectNode(parentNode: Node<NodeData>, deploymentProjectConfig: DeploymentProjectConfig): Node<NodeData> {
        let node = this.buildNode("deploymentProject", new DeploymentProjectNodeData(this.commandResult, deploymentProjectConfig))
        this.buildEdge(parentNode, node, "deployments")

        deploymentProjectConfig.vars?.forEach(varsSource => {
            let child = this.buildVarsSourceNode(node, varsSource)
            node.data.merge(child.data)
        })
        deploymentProjectConfig.deployments?.forEach(deploymentItem => {
            let child = this.buildDeploymentItemNode(node, deploymentItem)
            node.data.merge(child.data)
        })

        return node
    }

    buildVarsSourceNode(parentNode: Node<NodeData>, varsSource: VarsSource): Node<NodeData> {
        let node = this.buildNode("varsSource", new VarsSourceNodeData(this.commandResult, varsSource))
        this.buildEdge(parentNode, node, "vars")
        return node
    }

    buildDeploymentItemNode(parentNode: Node<NodeData>, deploymentItem: DeploymentItemConfig): Node<NodeData> {
        let node = this.buildNode("deploymentItem", new DeploymentItemNodeData(this.commandResult, deploymentItem))
        this.buildEdge(parentNode, node, "deployments")

        if (deploymentItem.renderedInclude !== undefined) {
            let child = this.buildDeploymentProjectNode( node, deploymentItem.renderedInclude)
            node.data.merge(child.data)
        }

        deploymentItem.vars?.forEach(varsSource => {
            let child = this.buildVarsSourceNode(node, varsSource)
            node.data.merge(child.data)
        })
        deploymentItem.renderedObjects?.forEach(renderedObject => {
            let child = this.buildObjectNode(node, renderedObject)
            node.data.merge(child.data)
        })

        return node
    }

    buildObjectNode(parentNode: Node<NodeData>, objectRef: ObjectRef): Node<NodeData> {
        let node = this.buildNode("object", new ObjectNodeData(this.commandResult, objectRef))
        this.buildEdge(parentNode, node, "deployments")

        let co = this.changedObjectsMap[buildObjectRefKey(objectRef)]
        if (co === undefined) {
            // TODO fix this (should be based on commandResult.newObjects)
            node.data.diffStatus.newObjects.push(objectRef)
        } else {
            node.data.diffStatus.addChangedObject(co)
        }

        return node
    }
}

function buildObjectRefFromObject(obj: UnstructuredObject): ObjectRef {
    const apiVersion: string = obj.object.apiVersion
    const s = apiVersion.split("/", 2)
    let ref = new ObjectRef()
    if (s.length == 1) {
        ref.version = s[0]
    } else {
        ref.group = s[0]
        ref.version = s[1]
    }
    ref.kind = obj.object.kind
    ref.namespace = obj.object.metadata.namespace
    ref.name = obj.object.metadata.name
    return ref
}

function buildObjectRefKey(ref: ObjectRef): string {
    return [ref.group, ref.version, ref.kind, ref.namespace, ref.name].join("+")
}