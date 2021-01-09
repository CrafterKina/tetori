import {TetoriContents} from "./Tetori";
import React, {Reducer, useEffect, useReducer} from "react";


type PlainTextParsing = { text: string, blanks: number | false, lines: number | false, allowEmpty: boolean };

export function PlainTextParser(props: { onChange(params: { message: string, edit(): TetoriContents }): void }) {
    const {onChange} = props
    const [state, dispatch] = useReducer<Reducer<PlainTextParsing,
        { type: "text", text: string } |
        { type: "blanks", num: number | false } |
        { type: "lines", num: number | false } |
        { type: "allowEmpty", tf: boolean }>>(
        (state, action) => {
            switch (action.type) {
                case "text":
                    return Object.assign({}, state, {text: action.text});
                case "blanks":
                    return Object.assign({}, state, {blanks: action.num});
                case "lines":
                    return Object.assign({}, state, {lines: action.num});
                case "allowEmpty":
                    return Object.assign({}, state, {allowEmpty: action.tf});
                default:
                    throw new Error();
            }
        }, {text: "", blanks: 1, lines: false, allowEmpty: true});

    useEffect(() => {
        onChange({
            message: `プレーンテキストから読み込み 空行数: ${state.blanks}, 行数: ${state.lines}, 空要素許容: ${state.allowEmpty}, テキスト: ${state.text.slice(0, 20)}`,
            edit(): TetoriContents {
                return parsePlainText(state);
            }
        })
    }, [onChange, state])

    return (
        <div>
            <div>
                <label>
                    <input type={"checkbox"} checked={state.blanks !== false} onChange={(e) => {
                        dispatch({type: "blanks", num: e.target.checked ? 0 : false});
                    }}/>
                    <input type={"number"} disabled={state.blanks === false}
                           value={(state.blanks || 0).toString()}
                           onChange={(e) => {
                               dispatch({type: "blanks", num: parseInt(e.target.value)});
                           }}/>
                    {"連続空行で段落とみなす"}
                </label>
                <label>
                    <input type={"checkbox"} checked={state.lines !== false} onChange={(e) => {
                        dispatch({type: "lines", num: e.target.checked ? 0 : false});
                    }}/>
                    <input type={"number"} disabled={state.lines === false}
                           value={(state.lines || 0).toString()}
                           onChange={(e) => {
                               dispatch({type: "lines", num: parseInt(e.target.value)});
                           }}/>
                    {"複数行を段落とみなす"}
                </label>
                <label>
                    <input type={"checkbox"}
                           checked={state.allowEmpty}
                           onChange={(e) => {
                               dispatch({type: "allowEmpty", tf: e.target.checked});
                           }}/>
                    {"空の要素を許容する"}
                </label>
            </div>
            <textarea value={state.text}
                      onChange={(event) => {
                          dispatch({type: "text", text: event.target.value});
                      }}/>
        </div>
    )
}

export function splitPlainText(paramsObj: PlainTextParsing): string[] {
    const {text, blanks, lines, allowEmpty} = paramsObj;
    const bulk = blanks ? text.split(RegExp("\n{" + (blanks + 1) + ",}")) : [text];
    const paragraphs: string[] = [];
    if (lines) {
        for (let string of bulk) {
            const l = string.split("\n");
            for (let i = 0; i < l.length; i += lines) {
                paragraphs.push(l.slice(i, i + lines).join("\n"));
            }
        }
    } else return allowEmpty ? bulk : bulk.filter(e => e.length !== 0);
    return allowEmpty ? paragraphs : paragraphs.filter(e => e.length !== 0);
}

function parsePlainText(paramsObj: PlainTextParsing): TetoriContents {
    return splitPlainText(paramsObj).map(e => ({dialog: e, pane: {}}));
}