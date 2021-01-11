import React, {useCallback} from "react";
import {useDrag, useDrop} from "react-dnd";

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
            className={"box"}
            style={{
                width: note.w,
                height: note.h,
            }}/>
    </div>)
}

export function InformationPane(props: { notes: Note[] }) {
    return (
        <div className={"pane"}>
            {props.notes.map(n => <DraggableBox key={n.key} note={n}/>)}
        </div>)
}

function NotePalette(props: { createNote(): void }) {
    return (<aside className={"palette"}>
        <h1>パレット</h1>
        <ul>
            <li onClick={props.createNote}>{"テキスト"}</li>
        </ul>
    </aside>)
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

export function InformationPaneEditor(props: { editPane(pane: NoteMap): void, pane: NoteMap }) {
    const {pane, editPane} = props;

    const createNote = useCallback(() => {
        const addition: NoteMap = {}
        const key = generateUUID();
        addition[key] = {x: 0, y: 0, h: 300, w: 300, key}
        editPane(Object.assign({}, pane, addition))
    }, [editPane, pane]);

    const moveNote = useCallback((id: string, left: number, top: number) => {
        const replace: NoteMap = {};
        replace[id] = Object.assign({}, pane[id], {x: left, y: top});
        editPane(Object.assign({}, pane, replace))
    }, [editPane, pane]);

    const [, drop] = useDrop({
        accept: [ItemTypes.TEXT],
        drop(item: NotePacket, monitor) {
            const {id, x, y} = item;
            const {x: dx, y: dy} = monitor.getDifferenceFromInitialOffset() || {x: 0, y: 0};
            const left = Math.round(x + dx);
            const top = Math.round(y + dy);
            moveNote(id, left, top);
            return undefined;
        }
    })

    return (<div className={"pane-editor"} ref={drop}>
        <InformationPane notes={Object.values(props.pane)}/>
        <NotePalette createNote={createNote}/>
    </div>)
}