import { memo } from "react";
import { Box } from "@mui/material";
import { DiffStatus, HealthStatus } from "./NodeData";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';
import DangerousIcon from '@mui/icons-material/Dangerous';
import Tooltip from "@mui/material/Tooltip";
import SvgIcon, { SvgIconTypeMap } from "@mui/material/SvgIcon";

interface StatusProps {
    tooltip: React.ReactNode;
    IconComponent: typeof SvgIcon;
    iconColor: SvgIconTypeMap["props"]["color"]
}

const Status = memo((props: StatusProps): React.ReactElement => {
    const {
        tooltip,
        IconComponent,
        iconColor
    } = props;

    return (
        <Tooltip title={tooltip}>
            <Box display="flex" alignItems="center">
                <IconComponent color={iconColor} />
            </Box>
        </Tooltip>
    )
})

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

    return (
        <Box
            display="flex"
            alignItems="center"
            fontSize="130%"
            gap="8px"
            sx={{ cursor: "pointer" }}
        >
            {newObjects.length > 0 &&
                <Status
                    tooltip={`New objects: ${newObjects.length}`}
                    IconComponent={NoteAddIcon}
                    iconColor="primary"
                />
            }
            {deletedObjects.length > 0 &&
                <Status
                    tooltip={`Deleted objects: ${deletedObjects.length}`}
                    IconComponent={DeleteIcon}
                    iconColor="error"
                />
            }
            {(totalDeletions > 0 || totalInsertions > 0 || totalUpdates > 0) &&
                <Status
                    tooltip={
                        <>
                            Total deletions: {totalDeletions}<br />
                            Total insertions: {totalInsertions}<br />
                            Total updates: {totalUpdates}<br />
                        </>
                    }
                    IconComponent={EditIcon}
                    iconColor="secondary"
                />
            }
            {healthStatus && healthStatus.warnings.length > 0 &&
                <Status
                    tooltip={`Warnings: ${healthStatus.warnings.length}`}
                    IconComponent={WarningIcon}
                    iconColor="warning"
                />
            }
            {healthStatus && healthStatus.errors.length > 0 &&
                <Status
                    tooltip={`Errors: ${healthStatus.errors.length}`}
                    IconComponent={DangerousIcon}
                    iconColor="error"
                />
            }
        </Box>
    )
});
