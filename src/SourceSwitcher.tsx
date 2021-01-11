import React, {ChangeEvent, Dispatch, useState} from "react";
import {PlainTextParser} from "./PlainTextParser";
import {EditMessage} from "./App";
import {Pages} from "./Tetori";

export function SourceSwitcher(props: { dispatchEditMessage: Dispatch<EditMessage> }) {
    const {dispatchEditMessage} = props;
    const [source, setSource] = useState<SourceType>("plain_text");
    const [delayed, setDelayed] = useState<{ message: string, edit: () => Pages }>();

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
        <Source type={source} onChange={setDelayed}/>
        <button onClick={() => {
            if (delayed) {
                dispatchEditMessage({
                    type: "edit",
                    snapshot: {pages: delayed.edit(), panes: [{}], pos: 0},
                    message: delayed.message
                });
            }
        }}>{"読み込み"}</button>
    </div>)
}

type SourceType = "plain_text" | "json" | "url"

function isSourceType(t: string): t is SourceType {
    return t === "plain_text" || t === "json" || t === "url";

}

type SourceProps = {
    type: SourceType,
    onChange(params: { message: string, edit(): Pages }): void
}

function Source(props: SourceProps) {
    switch (props.type) {
        case "plain_text":
            return (<PlainTextParser onChange={props.onChange}/>)
        case "json":
            return (<JsonTetoriDecoder onChange={props.onChange}/>)
        case "url":
            return (<HTMLTetoriDecoder onChange={props.onChange}/>)
        default:
            throw new Error();
    }
}

function JsonTetoriDecoder(props: { onChange(params: { message: string, edit(): Pages }): void }) {
    return (<textarea onChange={(event) => {
        try {
            props.onChange({edit: () => JSON.parse(event.target.value), message: "JSONからのロード"})
        } catch (e: unknown) {
            // todo error handling
        }
    }}/>)
}

function HTMLTetoriDecoder(props: { onChange(params: { message: string, edit(): Pages }): void }) {
    const [url, setUrl] = useState("");
    return (<div>
        <input type={"text"} value={url}
               onChange={(event) => setUrl(event.target.value)}/>
    </div>)
}