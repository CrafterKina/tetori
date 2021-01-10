import React, {Dispatch, Reducer, useCallback, useReducer, useState} from "react";
import {NavigableDialog} from "./NavigableDialog";
import {InformationPaneEditor, NoteMap} from "./InformationPane";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import "./tetori.css"
import {EditMessage} from "./App";

export interface TetoriPage {
    pane?: number
    dialog: string
}

export type TetoriContents = Array<TetoriPage>
type TetoriPanes = Array<NoteMap>

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

    const [panes, setPanes] = useState<TetoriPanes>([{}]);

    const update = useCallback((message: string, partial: Partial<TetoriPage>) => {
        const page = Object.assign({}, contents[pos], partial);
        const snapshot = contents.slice();
        snapshot[pos] = page;
        dispatchEditMessage({type: "edit", message, snapshot});
    }, [contents, dispatchEditMessage, pos]);

    const editPane = useCallback((newPane: NoteMap) => {
        setPanes(panes.concat(newPane));
        update("Paneの編集", {pane: panes.length})
    }, [panes, update]);

    return (<div>
        <DndProvider backend={HTML5Backend}>
            <InformationPaneEditor pane={panes[contents[pos]?.pane ?? panes.length - 1]}
                                   editPane={editPane}/>
        </DndProvider>
        <NavigableDialog contents={contents.map(c => c.dialog)} pos={clamp(pos, 0, contents.length - 1)}
                         dispatchPosMessage={dispatchPosMessage}/>
    </div>)
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}