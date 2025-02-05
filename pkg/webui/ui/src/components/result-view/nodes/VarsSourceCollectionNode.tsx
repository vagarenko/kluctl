import { VarsSource } from "../../../models";
import { NodeData } from "./NodeData";
import React from "react";
import { CommandResultProps } from "../CommandResultView";
import { SidePanelTab } from "../SidePanel";
import { BracketsSquareIcon } from "../../../icons/Icons";

export class VarsSourceCollectionNodeData extends NodeData {
    varsSources: VarsSource[] = []

    constructor(props: CommandResultProps, id: string) {
        super(props, id, false, false);
    }

    buildSidePanelTitle(): React.ReactNode {
        return "vars: " + this.varsSources.length
    }

    buildIcon(): [React.ReactNode, string] {
        return [<BracketsSquareIcon />, "vars"]
    }

    buildSidePanelTabs(): SidePanelTab[] {
        return [];
    }
}
