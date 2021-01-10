import {TetoriContents} from "./Tetori";
import React, {useState} from "react";

type PlainTextParsing = { text: string, blanks: number, lines: number, allowEmpty: boolean, allowEmptyLine: boolean };

export function PlainTextParser(props: { onChange(params: { message: string, edit(): TetoriContents }): void }) {
    const {onChange} = props
    const [state, setState] = useState<PlainTextParsing>({
        text: "",
        blanks: 1,
        lines: 0,
        allowEmpty: false,
        allowEmptyLine: false
    });

    const update = (value: Partial<PlainTextParsing>) => setState(prevState => {
        const state = Object.assign({}, prevState, value);
        onChange({
            message: `プレーンテキストから読み込み 空行数: ${state.blanks}, 行数: ${state.lines}, 空要素許容: ${state.allowEmpty}, 空行許容: ${state.allowEmptyLine}, テキスト: ${state.text.slice(0, 20)}`,
            edit(): TetoriContents {
                return parsePlainText(state);
            }
        })
        return state;
    });

    return (
        <div>
            <div>
                <label>
                    <input type={"number"}
                           value={(state.blanks || 0).toString()}
                           onChange={(e) => {
                               update({blanks: parseInt(e.target.value)});
                           }}/>
                    {"連続空行で段落とみなす"}
                </label>
                <label>
                    <input type={"number"}
                           value={(state.lines || 0).toString()}
                           onChange={(e) => {
                               update({lines: parseInt(e.target.value)});
                           }}/>
                    {"複数行を段落とみなす"}
                </label>
                <label>
                    <input type={"checkbox"}
                           checked={state.allowEmpty}
                           onChange={(e) => {
                               update({allowEmpty: e.target.checked});
                           }}/>
                    {"空の要素を許容する"}
                </label>
                <label>
                    <input type={"checkbox"}
                           checked={state.allowEmptyLine}
                           onChange={(e) => {
                               update({allowEmptyLine: e.target.checked});
                           }}/>
                    {"空行を許容する"}
                </label>
            </div>
            <textarea value={state.text}
                      onChange={(e) => {
                          update({text: e.target.value});
                      }}/>
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
    if (blanks > 0) chunk = chunk.flatMap(s => blanksToSplit(s, blanks));
    if (lines > 0) chunk = chunk.flatMap(s => linesToSplit(s, lines));
    if (!allowEmpty) chunk = chunk.filter(e => e.length !== 0);
    if (!allowEmptyLine) chunk = chunk.map(s => s.replaceAll(/^\n|\n$/g, "").replaceAll(/\n+/g, "\n"));
    return chunk;
}

function parsePlainText(paramsObj: PlainTextParsing): TetoriContents {
    return splitPlainText(paramsObj).map(e => ({dialog: e, pane: {}}));
}