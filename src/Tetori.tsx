import React, {Reducer, useEffect, useReducer} from "react";
import {NavigableDialog} from "./NavigableDialog";

export interface TetoriPage {
    dialog: string
}

export type TetoriContent = Array<TetoriPage>

type Props = {
    contents: TetoriContent
}

export type PosAction = { type: "next" } | { type: "previous" } | { type: "clamp" }

export function Tetori(props: Props) {
    const [pos, dispatchPosMessage] = useReducer<Reducer<number, PosAction>>((state, action) => {
            switch (action.type) {
                case "next":
                    return props.contents[state + 1] !== undefined ? state + 1 : state;
                case "previous":
                    return props.contents[state - 1] !== undefined ? state - 1 : state;
                case "clamp":
                    return Math.max(0, Math.min(props.contents.length - 1, state));
                default:
                    throw new Error();
            }
        },
        0);

    useEffect(() => {
        dispatchPosMessage({type: "clamp"})
    }, [props.contents]);

    return (<div>
        <NavigableDialog content={props.contents} pos={pos} dispatchPosMessage={dispatchPosMessage}/>
    </div>)
}