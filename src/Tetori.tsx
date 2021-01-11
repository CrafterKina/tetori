import React, {Dispatch, useCallback} from "react";
import {NavigableDialog} from "./NavigableDialog";
import {InformationPaneEditor, NoteMap} from "./InformationPane";
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
            snapshot: {pages: newPages, panes: pane ? panes.concat(pane) : panes, pos: p ?? pos}
        });
    }, [dispatchEditMessage, pages, panes, pos]);

    const editPane = useCallback(
        // 編集履歴のような機構をEditorが知る必要はない (このメソッドはpanes.lengthに依存)
        (newPane: NoteMap) => reduce("Paneの編集", {page: {pane: panes.length}, pane: newPane}),
        [panes.length, reduce]
    );

    return (<div>
        <DndProvider backend={HTML5Backend}>
            <InformationPaneEditor pane={panes[pages[pos]?.pane ?? panes.length - 1]}
                                   editPane={editPane}/>
        </DndProvider>
        <NavigableDialog contents={pages.map(c => c.dialog)} pos={pos}
                         updatePos={reduce}/>
    </div>)
}