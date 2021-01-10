import React, {Dispatch, Reducer, useCallback, useReducer} from "react";
import {NavigableDialog} from "./NavigableDialog";
import {InformationPaneEditor, NoteMap} from "./InformationPane";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import "./tetori.css"
import {EditMessage} from "./App";

export interface TetoriPage {
    pane: NoteMap
    dialog: string
}

export type TetoriContents = Array<TetoriPage>

type Props = {
    dispatchEditMessage: Dispatch<EditMessage>
    contents: TetoriContents
}

export type PosAction = { type: "next" } | { type: "previous" } | { type: "clamp" }

export function Tetori(props: Props) {
    const {contents, dispatchEditMessage} = props;
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

    const update = useCallback((message: string, partial: Partial<TetoriPage>) => {
        const page = Object.assign({}, contents[pos], partial);
        const snapshot = contents.slice();
        snapshot[pos] = page;
        dispatchEditMessage({type: "edit", message, snapshot});
    }, [contents, dispatchEditMessage, pos]);

    return (<div>
        <DndProvider backend={HTML5Backend}>
            <InformationPaneEditor pane={contents[pos]?.pane ?? {}} updatePage={update}/>
        </DndProvider>
        <NavigableDialog contents={contents.map(c => c.dialog)} pos={clamp(pos, 0, contents.length - 1)}
                         dispatchPosMessage={dispatchPosMessage}/>
    </div>)
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}