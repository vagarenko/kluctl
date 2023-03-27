import { Box, Divider, Drawer, IconButton } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NodeData } from "./nodes/buildNodes";
import { Node } from "reactflow";
import Typography from "@mui/material/Typography";

export interface SidePanelProps {
    node: Node<NodeData> | null;
    onClose: () => void;
}

export function SidePanel(props: SidePanelProps) {
    const { onClose, node } = props;

    return <div>
        <Drawer
            sx={{
                width: 500,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 500,
                },
            }}
            variant="persistent"
            anchor="right"
            open={!!node}
        >
            <Box height="40px">
                <IconButton onClick={onClose}>
                    <ChevronRightIcon />
                </IconButton>
            </Box>
            <Divider />
            <Box display="flex" flexDirection="column" flex="1 1 auto" overflow="hidden" p={3}>
                <Typography variant="h4" mb={3}>
                    {node?.type}
                </Typography>
                <Box display="flex" flexDirection="column" flex="1 1 auto" overflow="auto">
                    {node && getContent(node)}
                </Box>
            </Box>
        </Drawer>
    </div>
}

function getContent(node: Node<NodeData>): React.ReactElement | null {
    const data = node.data as any;
    switch (node.type) {
        case "commandResult":
            return <>
                command: {data.commandResult.command.command}<br />
                target: {data.commandResult.command.target!.name}<br />
            </>
        case "deploymentProject":
            return <>
                tags: {data.deploymentProject.tags}<br />
            </>
        case "varsSource":
            return <>
                varsCount: {Object.keys(data.varsSource.renderedVars?.object).length}
            </>
        case "deploymentItem":
            return <>
                path: {data.deploymentItem.path}<br />
                objectCount: {data.deploymentItem.renderedObjects?.length}<br />
            </>
        case "object":
            return <>
                group: {data.objectRef.group}<br />
                version: {data.objectRef.version}<br />
                kind: {data.objectRef.kind}<br />
                name: {data.objectRef.name}<br />
                namespace: {data.objectRef.namespace!}<br />
            </>
        default:
            return null;
    }
}
