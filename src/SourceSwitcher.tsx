import React, {ChangeEvent, useState} from "react";
import {TetoriContent} from "./Tetori";
import {PlainTextParser} from "./PlainTextParser";

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
    switch (props.type) {
        case "plain_text":
            return (<PlainTextParser setTetoriContent={props.setTetoriContent}/>)
        case "json":
            return (<JsonTetoriDecoder setTetoriContent={props.setTetoriContent}/>)
        case "url":
            return (<HTMLTetoriDecoder setTetoriContent={props.setTetoriContent}/>)
        default:
            throw new Error();
    }
}

function JsonTetoriDecoder(props: { setTetoriContent(contents: TetoriContent): void }) {
    return (<textarea onChange={(event) => {
        try {
            props.setTetoriContent(JSON.parse(event.target.value))
        } catch (e: unknown) {
            // todo error handling
        }
    }}/>)
}

function HTMLTetoriDecoder(props: { setTetoriContent(contents: TetoriContent): void }) {
    const [url, setUrl] = useState("");
    return (<div>
        <input type={"text"} value={url}
               onChange={(event) => setUrl(event.target.value)}/>
        <button>Load</button>
    </div>)
}