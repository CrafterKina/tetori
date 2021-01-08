import React, {Dispatch, Reducer, useReducer} from "react";
import {useDrag, useDrop} from "react-dnd";

type Note = {
    key: string,
    y: number, x: number,
    h: number, w: number,
}

type NotePacket = {
    type: "box"
    id: string,
    y: number, x: number
}

type NoteMap = {
    [key: string]: Note
}

const ItemTypes: { BOX: "box" } = {
    BOX: "box"
}

function DraggableBox(props: { note: Note }) {
    const {note} = props;
    const [, drag] = useDrag<NotePacket, unknown, unknown>({
        item: {x: note.x, y: note.y, id: note.key, type: ItemTypes.BOX}
    })
    return <div ref={drag}
                style={{
                    position: "absolute",
                    left: note.x,
                    top: note.y,
                    width: note.w,
                    height: note.h,
                    resize: "both",
                    backgroundColor: "rebeccapurple"
                }}/>
}

type MoveMessage = { type: "move", id: string, left: number, top: number }

function InformationPane(props: { notes: Note[], dispatch: Dispatch<MoveMessage> }) {
    const [, drop] = useDrop({
        accept: [ItemTypes.BOX],
        drop(item: NotePacket, monitor) {
            const {id, x, y} = item;
            const {x: dx, y: dy} = monitor.getDifferenceFromInitialOffset() || {x: 0, y: 0};
            const left = Math.round(x + dx);
            const top = Math.round(y + dy);
            props.dispatch({type: "move", id, left, top});
            return undefined;
        }
    })

    return (<div ref={drop} style={{width: "1024px", height: "1024px", position: "relative"}}>
        {props.notes.map(n => <DraggableBox key={n.key} note={n}/>)}
    </div>)
}

type CreateMessage = { type: "create" }

function NotePalette(props: { dispatch: Dispatch<CreateMessage> }) {
    return (<ul>
        <li onClick={() => props.dispatch({type: "create"})}>{"textbox"}</li>
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

export function InformationPaneEditor() {
    const [notes, dispatchNotesMessage] = useReducer<Reducer<NoteMap,
        MoveMessage | CreateMessage>>(
        (state, action) => {
            switch (action.type) {
                case "create":
                    const addition: NoteMap = {}
                    const key = generateUUID();
                    addition[key] = {x: 0, y: 0, h: 300, w: 300, key}
                    return Object.assign({}, state, addition);
                case "move":
                    const replace: NoteMap = {};
                    replace[action.id] = Object.assign({}, state[action.id], {x: action.left, y: action.top});
                    return Object.assign({}, state, replace);
            }
        }, {});

    return (<div>
        <InformationPane notes={Object.values(notes)} dispatch={dispatchNotesMessage}/>
        <NotePalette dispatch={dispatchNotesMessage}/>
    </div>)
}