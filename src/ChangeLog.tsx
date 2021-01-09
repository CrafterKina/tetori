import React, {Dispatch} from "react";
import {JumpMessage} from "./App";

export function ChangeLog(props: { dispatchJumpMessage: Dispatch<JumpMessage>, log: string[] }) {
    return (<ol>
        {props.log.map((e, i) => <li key={i} onClick={() => {
            props.dispatchJumpMessage({type: "jump", to: i})
        }}>{e}</li>)}
    </ol>)
}