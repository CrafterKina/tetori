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
        <div hidden={true}>
            <label>
                <input type={"radio"} checked={source === "plain_text"} onChange={onSourceChanged}
                       value={"plain_text"}/> {"PlainText"}
            </label>
            <label>
                <input type={"radio"} checked={source === "json"} onChange={onSourceChanged} value={"json"}/> {"JSON"}
            </label>
        </div>
        <Source type={source} dispatchEditMessage={dispatchEditMessage}/>
    </div>)
}

type SourceType = "plain_text" | "json"

function isSourceType(t: string): t is SourceType {
    return t === "plain_text" || t === "json";

}

type SourceProps = {
    type: SourceType,
    dispatchEditMessage: Dispatch<EditMessage>
}

function Source(props: SourceProps) {
    switch (props.type) {
        case "plain_text":
            return (<PlainTextParser dispatchEditMessage={props.dispatchEditMessage}/>)
        case "json":
            return (<JsonTetoriDecoder dispatchEditMessage={props.dispatchEditMessage}/>)
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

