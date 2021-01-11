import React, {Dispatch, useCallback, useState} from "react";
import {NavigableDialog} from "./NavigableDialog";
import {InformationPane, InformationPaneEditor, NoteMap} from "./InformationPane";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import "./tetori.css"
import {EditMessage} from "./App";

export interface Page {
    pane?: number
    dialog: string
}

export type Pages = Array<Page>
export type Panes = Array<NoteMap>
export type Snapshot = { pos: number, pages: Pages, panes: Panes }

export const EmptySnapshot = (): Snapshot => ({pos: 0, pages: [], panes: [[]]})

type Props = {
    dispatchEditMessage: Dispatch<EditMessage>
} & Snapshot

export function Tetori(props: Props) {
    const {panes, pages, dispatchEditMessage, pos} = props;

    const reduce = useCallback((message: string, args: { page?: Partial<Page>, pane?: NoteMap, pos?: number }) => {
        const {pos: p, pane, page: partial} = args;
        const page = Object.assign({}, pages[pos], partial);
        const newPages = pages.slice();
        newPages[pos] = page;
        dispatchEditMessage({
            type: "edit",
            message,
            snapshot: {pages: newPages, panes: pane ? panes.concat([pane]) : panes, pos: p ?? pos}
        });
    }, [dispatchEditMessage, pages, panes, pos]);

    const editPane = useCallback(
        // 編集履歴のような機構をEditorが知る必要はない (このメソッドはpanes.lengthに依存)
        (newPane: NoteMap) => reduce("Paneの編集", {page: {pane: panes.length}, pane: newPane}),
        [panes.length, reduce]
    );

    const [edit, setEdit] = useState(true);

    return (<div>
        <label><input type={"checkbox"} checked={edit} onChange={e => setEdit(e.target.checked)}/>編集モード</label>
        <div className={`tetori ${edit ? "edit" : ""}`}>
            <DndProvider backend={HTML5Backend}>
                {edit
                    ? <InformationPaneEditor pane={panes[pages[pos]?.pane ?? panes.length - 1]} editPane={editPane}/>
                    :
                    <InformationPane notes={Object.values(panes[pages[pos]?.pane ?? panes.length - 1])} remove={() => {
                    }}/>}
            </DndProvider>
            <NavigableDialog contents={pages.map(c => c.dialog)} pos={pos}
                             updatePos={reduce}/>
        </div>
    </div>)
}