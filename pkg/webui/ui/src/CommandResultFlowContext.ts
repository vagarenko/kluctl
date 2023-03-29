import { createContext } from "react";

export interface CommandResultFlowContextProps {
    onHandleCollapse: (nodeId: string, handleId: string, collapse: boolean) => void;
    nodesWithCollapsedHandles: Map<string, Set<string>>
}

export const CommandResultFlowContext = createContext<CommandResultFlowContextProps>({
    onHandleCollapse: () => { },
    nodesWithCollapsedHandles: new Map()
});
