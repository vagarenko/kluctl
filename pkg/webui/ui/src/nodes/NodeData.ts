import { ChangedObject, DeploymentError, ObjectRef } from "../models";

export class DiffStatus  {
    newObjects: ObjectRef[] = [];
    removedObjects: ObjectRef[] = [];
    orphanObjects: ObjectRef[] = [];
    changedObjects: ChangedObject[] = [];

    totalInsertions: number = 0;
    totalDeletions: number = 0;
    totalUpdates: number = 0;

    addChangedObject(co: ChangedObject) {
        this.changedObjects.push(co)
        co.changes?.forEach(x => {
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
