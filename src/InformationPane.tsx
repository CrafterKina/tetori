import React, {useCallback} from "react";
import {useDrag, useDrop} from "react-dnd";
import {TetoriPage} from "./Tetori";

type Note = {
    key: string,
    y: number, x: number,
    h: number, w: number,
}

type NotePacket = {
    type: typeof ItemTypes[keyof typeof ItemTypes]
    id: string,
    y: number, x: number
}

export type NoteMap = {
    [key: string]: Note
}

const ItemTypes = {
    TEXT: "text"
} as const

function DraggableBox(props: { note: Note }) {
    const {note} = props;
    const [, drag] = useDrag<NotePacket, unknown, unknown>({
        item: {x: note.x, y: note.y, id: note.key, type: ItemTypes.TEXT}
    })
    return (<div className={"draggable-wrapper"} style={{
        left: note.x,
        top: note.y,
    }}>
        <div ref={drag} className={"drag-handle"}/>
        <textarea
            className={"resizable"}
            style={{
                width: note.w,
                height: note.h,
            }}/>
    </div>)
}

function InformationPane(props: { notes: Note[], moveNote(id: string, left: number, top: number): void }) {
    const [, drop] = useDrop({
        accept: [ItemTypes.TEXT],
        drop(item: NotePacket, monitor) {
            const {id, x, y} = item;
            const {x: dx, y: dy} = monitor.getDifferenceFromInitialOffset() || {x: 0, y: 0};
            const left = Math.round(x + dx);
            const top = Math.round(y + dy);
            props.moveNote(id, left, top);
            return undefined;
        }
    })

    return (
        <div className={"edit resizable"} ref={drop} style={{width: "1280px", height: "720px", position: "relative"}}>
            {props.notes.map(n => <DraggableBox key={n.key} note={n}/>)}
        </div>)
}

function NotePalette(props: { createNote(): void }) {
    return (<ul>
        <li onClick={props.createNote}>{"textbox"}</li>
    </ul>)
}

function generateUUID(): string {
    // https://qiita.com/psn/items/d7ac5bdb5b5633bae165
    // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
    // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case 'x':
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case 'y':
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join("");
}

export function InformationPaneEditor(props: { updatePage(message: string, partial: Partial<TetoriPage>): void, pane: NoteMap }) {
    const {pane, updatePage} = props;

    const createNote = useCallback(() => {
        const addition: NoteMap = {}
        const key = generateUUID();
        addition[key] = {x: 0, y: 0, h: 300, w: 300, key}
        updatePage("Noteを追加", {pane: Object.assign({}, pane, addition)})
    }, [pane, updatePage]);

    const moveNote = useCallback((id: string, left: number, top: number) => {
        const replace: NoteMap = {};
        replace[id] = Object.assign({}, pane[id], {x: left, y: top});
        updatePage("Noteを移動", {pane: Object.assign({}, pane, replace)});
    }, [pane, updatePage]);


    return (<div>
        <InformationPane notes={Object.values(props.pane)} moveNote={moveNote}/>
        <NotePalette createNote={createNote}/>
    </div>)
}