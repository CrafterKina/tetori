import React, {Dispatch} from "react";
import {PosAction, TetoriContents} from "./Tetori";


type Props = {
    contents: TetoriContents
    pos: number
    dispatchPosMessage: Dispatch<PosAction>
}

export function NavigableDialog(props: Props) {
    const {contents, pos, dispatchPosMessage} = props;

    return (<div>
        <p className={"dialog previous-dialog"} title={"Previous"}
           onClick={() => dispatchPosMessage({type: "previous"})}>{contents[pos - 1]?.dialog ?? "NA"}</p>
        <p className={"dialog next-dialog"} title={"Next"}
           onClick={() => dispatchPosMessage({type: "next"})}>{contents[pos]?.dialog ?? "NA"}</p>
    </div>)
}