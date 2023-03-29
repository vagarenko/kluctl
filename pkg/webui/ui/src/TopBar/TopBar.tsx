import { memo } from "react";
import { Box } from "@mui/material";
import { TOP_BAR_HEIGHT } from "../constants";
import { NodeStatusFilter } from "./NodeStatusFilter";
import { NodeStatusField } from "../nodes/NodeStatus";

export interface TopBarProps {
    onFilterChange: (filters: Set<NodeStatusField>) => void;
    activeFilters: Set<NodeStatusField>;
}

export const TopBar = memo((props: TopBarProps) => {
    const { onFilterChange, activeFilters } = props;

    return (
        <Box
            width="100%"
            height={`${TOP_BAR_HEIGHT}px`}
            flex="0 0 auto"
            boxShadow="rgba(0, 0, 0, 0.2) 0px 4px 8px 1px;"
            zIndex="2000"
            display="flex"
            alignItems="center"
            px={3}
        >
            <NodeStatusFilter onChange={onFilterChange} activeFilters={activeFilters}/>
        </Box>
    )
});
