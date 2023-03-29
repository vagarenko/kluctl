import { memo, useCallback } from "react";
import { Box, Chip } from "@mui/material";
import { NodeStatusField, NODE_STATUS_ICONS } from "../nodes/NodeStatus";

export interface NodeStatusFilterProps {
    activeFilters: Set<NodeStatusField>;
    onChange: (filters: Set<NodeStatusField>) => void;
}

export const NodeStatusFilter = memo((props: NodeStatusFilterProps) => {
    const { onChange, activeFilters } = props;

    const handleFilterClick = useCallback((f: NodeStatusField) => () => {
        const newFilters = new Set(activeFilters);

        if (newFilters.has(f)) {
            newFilters.delete(f);
        } else {
            newFilters.add(f);
        }

        onChange(newFilters);
    }, [activeFilters, onChange]);

    return (
        <Box
            display="flex"
            alignItems="center"
            gap="5px"
        >
            Filter:
            {(Object.keys(NODE_STATUS_ICONS) as NodeStatusField[]).map((f) => {
                const { IconComponent, color } = NODE_STATUS_ICONS[f];
                const isActive = activeFilters.has(f);
                const chipColor = isActive ? color : "default";
                return (
                    <Chip
                        key={f}
                        variant="filled"
                        color={chipColor}
                        label={
                            <IconComponent
                                color={isActive ? undefined : color}
                                htmlColor={isActive ? "white" : undefined}
                            />
                        }
                        onClick={handleFilterClick(f)}
                        sx={{
                            "& .MuiChip-label": {
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }
                        }}
                    />
                );
            })}
        </Box>
    )
})
