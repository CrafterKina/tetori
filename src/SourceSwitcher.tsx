import React, {ChangeEvent, Reducer, useReducer, useState} from "react";
import {TetoriContent} from "./Tetori";

export function SourceSwitcher(props: { setTetoriContent(tetoriContent: TetoriContent): void }) {
    const [source, setSource] = useState<SourceType>("plain_text");

    function onSourceChanged(event: ChangeEvent<HTMLInputElement>) {
        if (!isSourceType(event.target.value)) return;
        if (!event.target.checked) return;
        setSource(event.target.value);
    }

    return (<div>
        <div>
            <label>
                <input type={"radio"} checked={source === "plain_text"} onChange={onSourceChanged}
                       value={"plain_text"}/> {"PlainText"}
            </label>
            <label>
                <input type={"radio"} checked={source === "json"} onChange={onSourceChanged} value={"json"}/> {"JSON"}
            </label>
            <label>
                <input type={"radio"} checked={source === "url"} onChange={onSourceChanged} value={"url"}/> {"WebPage"}
            </label>
        </div>
        <Source type={source} setTetoriContent={props.setTetoriContent}/>
    </div>)
}

type SourceType = "plain_text" | "json" | "url"

function isSourceType(t: string): t is SourceType {
    return t === "plain_text" || t === "json" || t === "url";

}

type SourceProps = {
    type: SourceType,
    setTetoriContent(contents: TetoriContent): void
}

function Source(props: SourceProps) {
    const [state, dispatcher] = useReducer<Reducer<{ [s in SourceType]: string }, { type: SourceType, text: string }>>((state, action) => {
        switch (action.type) {
            case "plain_text": {
                props.setTetoriContent(parsePlainText(action.text));
                return Object.assign({}, state, {plain_text: action.text});
            }
            case "json": {
                try {
                    props.setTetoriContent(JSON.parse(action.text));
                } catch (e: unknown) {
                }
                return Object.assign({}, state, {json: action.text});
            }
            case "url":
                return Object.assign({}, state, {url: action.text});
        }
    }, {plain_text: "", json: "", url: ""});

    switch (props.type) {
        case "plain_text":
            return <textarea value={state.plain_text}
                             onChange={(event) => dispatcher({type: "plain_text", text: event.target.value})}/>
        case "json":
            return <textarea value={state.json}
                             onChange={(event) => dispatcher({type: "json", text: event.target.value})}/>
        case "url":
            return (
                <div>
                    <input type={"text"} value={state.url}
                           onChange={(event) => dispatcher({type: "url", text: event.target.value})}/>
                    <button>Load</button>
                </div>
            )
        default:
            throw new Error();
    }
}

export function parsePlainText(content: string): TetoriContent {
    const paragraphs = content.split("\n");
    return paragraphs.filter(p => p.length !== 0).map(p => {
        return {
            dialog: p
        }
    });
}