import ResizeObserver from 'rc-resize-observer';
import React, {useCallback, useRef} from "react";
import {useDrag, useDrop} from "react-dnd";

type Note = {
    key: string,
    y: number, x: number,
    h: number, w: number,
}

type NotePacket = {
    type: typeof ItemTypes[keyof typeof ItemTypes]
    id: number,
    y: number, x: number
}

export type NoteMap = Array<Note>

const ItemTypes = {
    TEXT: "text"
} as const

function DraggableBox(props: { note: Note, index: number, remove(): void, sizeChange(h: number, w: number): void }) {
    const {note, index, remove, sizeChange} = props;
    const [, drag] = useDrag<NotePacket, unknown, unknown>({
        item: {x: note.x, y: note.y, id: index, type: ItemTypes.TEXT}
    })

    const timeout = useRef<ReturnType<typeof setTimeout>>();

    return (<div className={"draggable-wrapper"} style={{
        left: note.x,
        top: note.y,
    }}>
        <div className={"note-navigation"}>
            <div ref={drag} className={"drag-handle"} title={"ドラッグで動かす"}/>
            <button className={"close-button"} onClick={remove} title={"閉じる"}/>
        </div>
        <ResizeObserver onResize={((size) => {
            if (note.h === size.height && note.w === size.width) return;
            if (timeout.current) clearTimeout(timeout.current);
            timeout.current = setTimeout(() => {
                sizeChange(size.height, size.width);
            }, 1000);
        })}>
            <textarea
                className={"box"}
                style={{
                    width: note.w,
                    height: note.h,
                    zIndex: index
                }}/>
        </ResizeObserver>
    </div>)
}

const doNothing = (() => {
});

export function InformationPane(props: { notes: Note[], remove?: (idx: number) => void, sizeChange?: (idx: number, h: number, w: number) => void }) {
    const remove = props.remove ?? doNothing
    const sizeChange = props.sizeChange ?? doNothing
    return (
        <div className={"pane"}>
            {props.notes.map((n, i) => <DraggableBox index={i} key={n.key} note={n} remove={() => remove(i)}
                                                     sizeChange={(h, w) => sizeChange(i, h, w)}/>)}
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
        editPane(pane.concat([{x: 0, y: 0, h: 300, w: 300, key: generateUUID()}]))
    }, [editPane, pane]);

    const moveNote = useCallback((idx: number, p: Partial<Omit<Note, "key">>) => {
        const replace = pane.slice();
        const append = Object.assign({}, replace.splice(idx, 1)[0], p)
        editPane(replace.concat([append]))
    }, [editPane, pane]);

    const removeNote = useCallback((idx: number) => {
        const replace = pane.slice();
        replace.splice(idx, 1);
        editPane(replace);
    }, [editPane, pane])

    const [, drop] = useDrop({
        accept: [ItemTypes.TEXT],
        drop(item: NotePacket, monitor) {
            const {id, x, y} = item;
            const {x: dx, y: dy} = monitor.getDifferenceFromInitialOffset() || {x: 0, y: 0};
            const left = Math.round(x + dx);
            const top = Math.round(y + dy);
            moveNote(id, {x: left, y: top});
            return undefined;
        }
    })

    return (<div className={"pane-editor"} ref={drop}>
        <InformationPane notes={pane} remove={removeNote} sizeChange={(n, h, w) => moveNote(n, {h, w})}/>
        <NotePalette createNote={createNote}/>
    </div>)
}