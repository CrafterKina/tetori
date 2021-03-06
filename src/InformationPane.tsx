import ResizeObserver from 'rc-resize-observer';
import React, {useCallback, useRef, useState} from "react";
import {useDrag, useDrop} from "react-dnd";
import {ImageLoader} from "./ImageLoader";

interface Note {
    type: typeof ItemTypes[keyof typeof ItemTypes],
    key: string,
    y: number,
    x: number,
    h?: number,
    w?: number,
}

interface TextNote extends Note {
    type: "text"
    h: number,
    w: number,
    text: string
}

function isTextNote(note: Note): note is TextNote {
    return note.type === "text";
}

interface ImageNote extends Note {
    type: "image"
    url: string
}

function isImageNote(note: Note): note is ImageNote {
    return note.type === "image";
}

type NotePacket = {
    type: typeof ItemTypes[keyof typeof ItemTypes]
    id: number,
    y: number, x: number
}

export type NoteMap = Array<Note>

const ItemTypes = {
    TEXT: "text",
    IMAGE: "image"
} as const

type EditNoteFunction = (p: Partial<Omit<Note, "key">>) => void

type BoxType<T extends Note> = {
    note: T,
    editNote: EditNoteFunction,
    index: number
}

function TextBox(props: BoxType<TextNote>) {
    const {note, editNote, index} = props;
    return <textarea
        value={note.text}
        onChange={(e) => editNote({text: e.target.value} as TextNote)}
        className={"box"}
        style={{
            width: note.w,
            height: note.h,
            zIndex: index
        }}/>;
}

function ImageBox(props: BoxType<ImageNote>) {
    const {note, index} = props;
    return <div className={"box"} draggable={false} style={{
        width: note.w,
        height: note.h,
        zIndex: index,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url(${note.url})`
    }}>
    </div>;
}

function Box(props: BoxType<Note>) {
    const {editNote, index, note} = props;
    if (isTextNote(note)) return (<TextBox note={note} editNote={editNote} index={index}/>)
    if (isImageNote(note)) return (<ImageBox note={note} editNote={editNote} index={index}/>)
    throw new Error();
}

function DraggableBox(props: { note: Note, index: number, remove(): void, editNote: EditNoteFunction }) {
    const {note, index, remove, editNote} = props;
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
                editNote({h: size.height, w: size.width});
            }, 1000);
        })}>
            <Box note={note} editNote={editNote} index={index}/>
        </ResizeObserver>
    </div>)
}

const doNothing = (() => {
});

export function InformationPane(props: { notes: Note[], remove?: (idx: number) => void, editNote?: (idx: number, p: Partial<Omit<Note, "key">>) => void }) {
    const remove = props.remove ?? doNothing
    const editNote = props.editNote ?? doNothing
    return (
        <div className={"pane"}>
            {props.notes.map((n, i) => <DraggableBox index={i} key={n.key} note={n} remove={() => remove(i)}
                                                     editNote={editNote.bind(undefined, i)}/>)}
        </div>)
}

function NotePalette(props: { createNote(note: Omit<Note, "key">): void }) {
    const [collapse, setCollapse] = useState(false);

    return (<aside className={"palette"}>
        <button onClick={() => setCollapse(!collapse)}>{`${collapse ? "開く" : "最小化"}`}</button>
        <h1>パレット</h1>
        <ul hidden={collapse}>
            <li onClick={() => props.createNote({
                type: "text",
                text: "",
                x: 0,
                y: 0,
                w: 300,
                h: 300
            } as TextNote)}>{"テキスト"}</li>
            <li><ImageLoader text={"画像"} apply={(url) => {
                const image = new Image();
                image.src = url;
                image.onload = function () {
                    let width = image.naturalWidth;
                    let height = image.naturalHeight;
                    if (width <= height) {
                        if (500 < height) {
                            width = 500 * width / height;
                            height = 500;
                        }
                    } else {
                        if (500 < width) {
                            height = 500 * height / width;
                            width = 500;
                        }
                    }
                    props.createNote({
                        type: "image",
                        url: url,
                        x: 0,
                        y: 0,
                        h: height,
                        w: width
                    } as ImageNote)
                }
            }}/></li>
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

    const createNote = useCallback((note: Partial<Note> & Omit<Note, "key">) => {
        editPane(pane.concat([Object.assign({}, note, {key: generateUUID()})]))
    }, [editPane, pane]);

    const editNote = useCallback((idx: number, p: Partial<Omit<Note, "key">>) => {
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
            editNote(id, {x: left, y: top});
            return undefined;
        }
    })

    return (<div className={"pane-editor"} ref={drop}>
        <InformationPane notes={pane} remove={removeNote} editNote={editNote}/>
        <NotePalette createNote={createNote}/>
    </div>)
}