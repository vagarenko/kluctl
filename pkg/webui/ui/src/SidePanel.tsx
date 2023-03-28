import { Box, Divider, Drawer, IconButton, Tab, Tabs, Typography } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NodeData } from "./nodes/NodeData";
import { Node } from "reactflow";
import { useCallback, useEffect, useState } from "react";
import { NodeType } from "./nodes/NodeBuilder";

export interface SidePanelProps {
    node: Node<NodeData, NodeType> | null;
    onClose: () => void;
}

export function SidePanel(props: SidePanelProps) {
    const { onClose, node } = props;

    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = useCallback((_e: React.SyntheticEvent, tab: number) => {
        setSelectedTab(tab);
    }, []);

    useEffect(() => {
        setSelectedTab(0);
    }, [node]);

    return <Box>
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
                {node &&
                    <>
                        <Typography variant="h4" mb={1} component="div">
                            {node.type}
                        </Typography>

                        <Box flex="0 0 auto" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={node?.type === "object" ? selectedTab : 0}
                                onChange={handleTabChange}
                            >
                                <Tab label="Info" key={0} />
                                {node.type === "object" &&
                                    [
                                        <Tab label="Rendered" key={1} />,
                                        <Tab label="Applied" key={2} />,
                                        <Tab label="Changes" key={3} />,
                                    ]
                                }
                            </Tabs>
                        </Box>

                        <Box mt={2} mx={2} display="flex" flexDirection="column" flex="1 1 auto" overflow="auto">
                            {selectedTab === 0 && node && getContent(node)}
                        </Box>
                    </>
                }
            </Box>
        </Drawer>
    </Box>
}

function getContent(node: Node<NodeData, NodeType>): React.ReactElement | null {
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
