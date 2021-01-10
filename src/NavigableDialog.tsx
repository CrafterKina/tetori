import React, {Dispatch} from "react";
import {PosAction} from "./Tetori";


type Props = {
    contents: string[]
    pos: number
    dispatchPosMessage: Dispatch<PosAction>
}

export function NavigableDialog(props: Props) {
    const {contents, pos, dispatchPosMessage} = props;

    return (<div>
        <p className={"dialog previous-dialog"} title={"Previous"}
           onClick={() => dispatchPosMessage({type: "previous"})}>{contents[pos - 1] ?? "NA"}</p>
        <p className={"dialog next-dialog"} title={"Next"}
           onClick={() => dispatchPosMessage({type: "next"})}>{contents[pos] ?? "NA"}</p>
    </div>)
}