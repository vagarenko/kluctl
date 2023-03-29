import { memo, useCallback } from "react";
import { Box } from "@mui/material";
import { DiffStatus, HealthStatus } from "./NodeData";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';
import DangerousIcon from '@mui/icons-material/Dangerous';
import Tooltip from "@mui/material/Tooltip";

export type NodeStatusField = keyof typeof NODE_STATUS_ICONS

export const NODE_STATUS_ICONS = {
    newObjects: { IconComponent: NoteAddIcon, color: "primary" },
    deletedObjects: { IconComponent: DeleteIcon, color: "error" },
    changedObjects: { IconComponent: EditIcon, color: "secondary" },
    warnings: { IconComponent: WarningIcon, color: "warning" },
    errors: { IconComponent: DangerousIcon, color: "error" }
} as const;

export interface NodeStatusProps {
    diffStatus: DiffStatus;
    healthStatus?: HealthStatus;
}

export const NodeStatus = memo((props: NodeStatusProps): React.ReactElement => {
    const { diffStatus, healthStatus } = props;
    const {
        newObjects,
        deletedObjects,
        totalInsertions,
        totalDeletions,
        totalUpdates
    } = diffStatus;

    const renderIcon = useCallback((icon: keyof typeof NODE_STATUS_ICONS, tooltip: React.ReactNode) => {
        const { IconComponent, color } = NODE_STATUS_ICONS[icon];
        return (
            <Tooltip title={tooltip}>
                <Box display="flex" alignItems="center">
                    <IconComponent color={color} />
                </Box>
            </Tooltip>
        );
    }, []);

    return (
        <Box
            display="flex"
            alignItems="center"
            gap="8px"
            sx={{ cursor: "pointer" }}
        >
            {newObjects.length > 0 && renderIcon("newObjects", `New objects: ${newObjects.length}`)}
            {deletedObjects.length > 0 && renderIcon("deletedObjects", `Deleted objects: ${deletedObjects.length}`)}
            {(totalDeletions > 0 || totalInsertions > 0 || totalUpdates > 0) &&
                renderIcon(
                    "changedObjects",
                    <>
                        Total deletions: {totalDeletions}<br />
                        Total insertions: {totalInsertions}<br />
                        Total updates: {totalUpdates}<br />
                    </>
                )
            }
            {healthStatus && healthStatus.warnings.length > 0 && renderIcon("warnings", `Warnings: ${healthStatus.warnings.length}`)}
            {healthStatus && healthStatus.errors.length > 0 && renderIcon("errors", `Errors: ${healthStatus.errors.length}`)}
        </Box>
    )
});
