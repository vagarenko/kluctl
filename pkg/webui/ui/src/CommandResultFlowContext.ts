import { createContext } from "react";

export interface CommandResultFlowContextProps {
    layoutCallback: (followNodeId?: string) => void;
}

export const CommandResultFlowContext = createContext<CommandResultFlowContextProps>({
    layoutCallback: (followNodeId?: string) => { }
});
