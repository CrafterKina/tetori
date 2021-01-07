import React, {Dispatch} from "react";
import {PosAction, TetoriContent} from "./Tetori";


type Props = {
    content: TetoriContent
    pos: number
    dispatchPosMessage: Dispatch<PosAction>
}

export function NavigableDialog(props: Props) {
    const {content, pos, dispatchPosMessage} = props;

    return (<div>
        <p title={"Previous"}
           onClick={() => dispatchPosMessage({type: "previous"})}>{content[pos - 1]?.dialog ?? "NA"}</p>
        <p>{content[pos]?.dialog ?? "NA"}</p>
        <button title={"Next"} onClick={() => dispatchPosMessage({type: "next"})}>{"↓"}</button>
    </div>)
}