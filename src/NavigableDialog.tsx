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
        <p title={"Previous"}
           onClick={() => dispatchPosMessage({type: "previous"})}>{contents[pos - 1]?.dialog ?? "NA"}</p>
        <p>{contents[pos]?.dialog ?? "NA"}</p>
        <button title={"Next"} onClick={() => dispatchPosMessage({type: "next"})}>{"↓"}</button>
    </div>)
}