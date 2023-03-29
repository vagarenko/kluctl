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

export type NodeType = keyof typeof nodeTypes 

const position = { x: 0, y: 0 };
const edgeType = 'default';

export class NodeBuilder {
    private commandResult: CommandResult
    private newObjectsMap: {[key:string]:UnstructuredObject} = {}
    private changedObjectsMap: {[key:string]:ChangedObject} = {}
    private errorsMap: {[key:string]:DeploymentError[]} = {}
    private warningsMap: {[key:string]:DeploymentError[]} = {}

    private nodes: Node<NodeData, NodeType>[] = []
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
        commandResult.errors?.forEach(e => {
            const key = buildObjectRefKey(e.ref)
            if (this.errorsMap[key] === undefined) {
                this.errorsMap[key] = []
            }
            this.errorsMap[key].push(e)
        })
        commandResult.warnings?.forEach(e => {
            const key = buildObjectRefKey(e.ref)
            if (this.warningsMap[key] === undefined) {
                this.warningsMap[key] = []
            }
            this.warningsMap[key].push(e)
        })
    }

    nextId: number = 1
    genNextId(): string {
        let id = this.nextId
        this.nextId++
        return id.toString()
    }

    buildNode<T extends NodeData, U extends NodeType>(type: U, data: T): Node<T, U> {
        let node: Node<T, U> = {
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

    buildRoot(): [Node<NodeData, NodeType>[], Edge[]] {
        let rootNode = this.buildNode("commandResult", new CommandResultNodeData(this.commandResult))

        let child = this.buildDeploymentProjectNode(rootNode, this.commandResult.deployment!)
        rootNode.data.merge(child.data)

        return [this.nodes, this.edges]
    }

    buildDeploymentProjectNode(parentNode: Node<NodeData, NodeType>, deploymentProjectConfig: DeploymentProjectConfig): Node<NodeData, NodeType> {
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

    buildVarsSourceNode(parentNode: Node<NodeData, NodeType>, varsSource: VarsSource): Node<NodeData, NodeType> {
        let node = this.buildNode("varsSource", new VarsSourceNodeData(this.commandResult, varsSource))
        this.buildEdge(parentNode, node, "vars")
        return node
    }

    buildDeploymentItemNode(parentNode: Node<NodeData, NodeType>, deploymentItem: DeploymentItemConfig): Node<NodeData, NodeType> {
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

    buildObjectNode(parentNode: Node<NodeData, NodeType>, objectRef: ObjectRef): Node<NodeData, NodeType> {
        let node = this.buildNode("object", new ObjectNodeData(this.commandResult, objectRef))
        this.buildEdge(parentNode, node, "deployments")

        const key = buildObjectRefKey(objectRef)
        let co = this.changedObjectsMap[key]
        if (co === undefined) {
            // TODO fix this (should be based on commandResult.newObjects)
            // node.data.diffStatus?.newObjects.push(objectRef)
        } else {
            node.data.diffStatus?.addChangedObject(co)
        }

        this.errorsMap[key]?.forEach(e => {
            node.data.healthStatus?.errors.push(e)
        })
        this.warningsMap[key]?.forEach(e => {
            node.data.healthStatus?.warnings.push(e)
        })

        // TODO: remove this.
        if (Math.random() > 0.5) {
            node.data.diffStatus?.newObjects.push(...Array(Math.floor(Math.random() * 10)));
        }
        if (Math.random() > 0.5) {
            node.data.diffStatus?.deletedObjects.push(...Array(Math.floor(Math.random() * 10)));
        }
        if (Math.random() > 0.5) {
            node.data.healthStatus?.errors.push(...Array(Math.floor(Math.random() * 10)));
        }
        if (Math.random() > 0.5) {
            node.data.healthStatus?.warnings.push(...Array(Math.floor(Math.random() * 10)));
        }

        return node
    }
}

function buildObjectRefFromObject(obj: UnstructuredObject): ObjectRef {
    const apiVersion: string = obj.object.apiVersion
    const s = apiVersion.split("/", 2)
    let ref = new ObjectRef()
    if (s.length === 1) {
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