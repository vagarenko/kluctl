import { ChangedObject, DeploymentError, ObjectRef } from "../models";
import { XYPosition } from "reactflow";

export class DiffStatus  {
    newObjects: ObjectRef[] = [];
    deletedObjects: ObjectRef[] = [];
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
        this.deletedObjects = this.deletedObjects.concat(other.deletedObjects)
        this.orphanObjects = this.orphanObjects.concat(other.orphanObjects)
        this.changedObjects = this.changedObjects.concat(other.changedObjects)

        this.totalInsertions += other.totalInsertions
        this.totalDeletions += other.totalDeletions
        this.totalUpdates += other.totalUpdates
    }
}

export class HealthStatus {
    errors: DeploymentError[] = []
    warnings: DeploymentError[] = []

    merge(other: HealthStatus) {
        this.errors = this.errors.concat(other.errors)
        this.warnings = this.warnings.concat(other.warnings)
    }
}

export abstract class NodeData {
    healthStatus?: HealthStatus;
    diffStatus?: DiffStatus;

    collapsedHandles: string[] = [];
    targetPosition?: XYPosition

    protected constructor(hasHealthStatus: boolean, hasDiffStatus: boolean) {
        if (hasHealthStatus) {
            this.healthStatus = new HealthStatus()
        }
        if (hasDiffStatus) {
            this.diffStatus = new DiffStatus()
        }
    }

    merge(other: NodeData) {
        if (this.diffStatus && other.diffStatus) {
            this.diffStatus.merge(other.diffStatus)
        }
        if (this.healthStatus && other.healthStatus) {
            this.healthStatus.merge(other.healthStatus)
        }
    }
}
