import React, {Reducer, useReducer} from "react";
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
            state = clamp(state, 0, props.contents.length - 1);
            switch (action.type) {
                case "next":
                    return props.contents[state + 1] !== undefined ? state + 1 : state;
                case "previous":
                    return props.contents[state - 1] !== undefined ? state - 1 : state;
                default:
                    throw new Error();
            }
        },
        0);

    return (<div>
        <NavigableDialog content={props.contents} pos={clamp(pos, 0, props.contents.length - 1)}
                         dispatchPosMessage={dispatchPosMessage}/>
    </div>)
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}