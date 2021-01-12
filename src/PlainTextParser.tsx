import {EmptySnapshot, Pages} from "./Tetori";
import React, {Dispatch, useState} from "react";
import {EditMessage} from "./App";

type PlainTextParsing = { text: string, blanks: number, lines: number, allowEmpty: boolean, allowEmptyLine: boolean };

export function PlainTextParser(props: { dispatchEditMessage: Dispatch<EditMessage> }) {
    const {dispatchEditMessage} = props
    const [state, setState] = useState<PlainTextParsing>({
        text: "",
        blanks: 1,
        lines: 0,
        allowEmpty: false,
        allowEmptyLine: false
    });


    return (
        <div>
            <div>
                <label>
                    <input type={"number"}
                           value={(state.blanks || 0).toString()}
                           onChange={(e) => {
                               setState(Object.assign({}, state, {blanks: parseInt(e.target.value)}));
                           }}/>
                    {"連続空行で段落とみなす"}
                </label>
                <label>
                    <input type={"number"}
                           value={(state.lines || 0).toString()}
                           onChange={(e) => {
                               setState(Object.assign({}, state, {lines: parseInt(e.target.value)}));
                           }}/>
                    {"複数行を段落とみなす"}
                </label>
                <label>
                    <input type={"checkbox"}
                           checked={state.allowEmpty}
                           onChange={(e) => {
                               setState(Object.assign({}, state, {allowEmpty: e.target.checked}));
                           }}/>
                    {"空の要素を許容する"}
                </label>
                <label>
                    <input type={"checkbox"}
                           checked={state.allowEmptyLine}
                           onChange={(e) => {
                               setState(Object.assign({}, state, {allowEmptyLine: e.target.checked}));
                           }}/>
                    {"空行を許容する"}
                </label>
            </div>
            <textarea value={state.text}
                      onChange={(e) => {
                          setState(Object.assign({}, state, {text: e.target.value}));
                      }}/>
            <button onClick={() => dispatchEditMessage({
                type: "edit",
                snapshot: Object.assign(EmptySnapshot(), {pages: parsePlainText(state)}),
                message: `プレーンテキストから読み込み 空行数: ${state.blanks}, 行数: ${state.lines}, 空要素許容: ${state.allowEmpty}, 空行許容: ${state.allowEmptyLine}, テキスト: ${state.text.slice(0, 20)}`
            })}>{"読み込み"}</button>
        </div>
    )
}

export function splitPlainText(paramsObj: PlainTextParsing): string[] {
    const {text, blanks, lines, allowEmpty, allowEmptyLine} = paramsObj;

    function blanksToSplit(text: string, num: number): string[] {
        return text.split(RegExp("\n{" + (num + 1) + ",}"));
    }

    function linesToSplit(text: string, num: number): string[] {
        const ret = [];
        const lines = text.split("\n");
        for (let i = 0; i < lines.length; i += num) {
            ret.push(lines.slice(i, i + num).join("\n"));
        }
        return ret;
    }

    let chunk = [text];
    // 空白しかない行を空行とみなすために前処理。\sだと\nが含まれてしまうため個別に指定している
    chunk = chunk.map(s => s.replaceAll(/^[\f\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+$/gm, ""));
    if (blanks > 0) chunk = chunk.flatMap(s => blanksToSplit(s, blanks));
    if (!allowEmptyLine) chunk = chunk.map(s => s.replaceAll(/^\n/gm, "").replaceAll(/\n$/g, ""));
    if (lines > 0) chunk = chunk.flatMap(s => linesToSplit(s, lines));
    if (!allowEmpty) chunk = chunk.filter(e => e.length !== 0 && !/^\s*$/.test(e));
    return chunk;
}

function parsePlainText(paramsObj: PlainTextParsing): Pages {
    return splitPlainText(paramsObj).map(e => ({dialog: e}));
}