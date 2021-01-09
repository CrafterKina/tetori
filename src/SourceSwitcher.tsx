import React, {ChangeEvent, Dispatch, useState} from "react";
import {PlainTextParser} from "./PlainTextParser";
import {EditMessage} from "./App";

export function SourceSwitcher(props: { dispatchEditMessage: Dispatch<EditMessage> }) {
    const {dispatchEditMessage} = props;
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
        <Source type={source} dispatchEditMessage={dispatchEditMessage}/>
    </div>)
}

type SourceType = "plain_text" | "json" | "url"

function isSourceType(t: string): t is SourceType {
    return t === "plain_text" || t === "json" || t === "url";

}

type SourceProps = {
    type: SourceType,
    dispatchEditMessage: Dispatch<EditMessage>
}

function Source(props: SourceProps) {
    const {dispatchEditMessage} = props;
    switch (props.type) {
        case "plain_text":
            return (<PlainTextParser dispatchEditMessage={dispatchEditMessage}/>)
        case "json":
            return (<JsonTetoriDecoder dispatchEditMessage={dispatchEditMessage}/>)
        case "url":
            return (<HTMLTetoriDecoder dispatchEditMessage={dispatchEditMessage}/>)
        default:
            throw new Error();
    }
}

function JsonTetoriDecoder(props: { dispatchEditMessage: Dispatch<EditMessage> }) {
    return (<textarea onChange={(event) => {
        try {
            props.dispatchEditMessage({type: "edit", snapshot: JSON.parse(event.target.value), message: "JSONからのロード"})
        } catch (e: unknown) {
            // todo error handling
        }
    }}/>)
}

function HTMLTetoriDecoder(props: { dispatchEditMessage: Dispatch<EditMessage> }) {
    const [url, setUrl] = useState("");
    return (<div>
        <input type={"text"} value={url}
               onChange={(event) => setUrl(event.target.value)}/>
        <button>Load</button>
    </div>)
}