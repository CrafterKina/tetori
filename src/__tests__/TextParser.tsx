import {parse, TextParser} from "../TextParser"
import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";

describe("text parsing", () => {
    test("空の文字列であれば空の配列を生成する", () => {
        expect(parse("")).toEqual([]);
        expect(parse("")).toHaveLength(0);
    });

    test("改行を含まない文字列はその文字列をdialogに持つObjectを要素とする配列を生成する", () => {
        expect(parse("foobarbaz")).toMatchObject([{dialog: "foobarbaz"}])
        expect(parse("ほげふが")).toMatchObject([{dialog: "ほげふが"}])
        expect(parse("foo<br>bar<br>baz")).toMatchObject([{dialog: "foo<br>bar<br>baz"}])
        expect(parse("foo\\nbar\\nbaz")).toMatchObject([{dialog: "foo\\nbar\\nbaz"}])
    })

    test("改行を含まない文字列はただ一つだけ要素を持つ配列を生成する", () => {
        expect(parse("foobarbaz")).toHaveLength(1);
        expect(parse("ほげふが")).toHaveLength(1);
        expect(parse("foo<br>bar<br>baz")).toHaveLength(1);
        expect(parse("foo\\nbar\\nbaz")).toHaveLength(1);
    })

    test("文字列の改行ごとに要素は分割される", () => {
        expect(parse("foo\nbar\nbaz")).toMatchObject([
            {dialog: "foo"},
            {dialog: "bar"},
            {dialog: "baz"}
        ])
        expect(parse("foo\nbar\nbaz")).toHaveLength(3)
    })

    test("dialogが空文字列の要素は生成しない", () => {
        expect(parse("\n")).toEqual([]);
        expect(parse("\n")).toHaveLength(0);
        expect(parse("foo\n\nbar")).toMatchObject([
            {dialog: "foo"},
            {dialog: "bar"}
        ]);
        expect(parse("foo\n\nbar")).toHaveLength(2);
    })
})

describe("rendering", () => {
    test("描画でき、編集ごとに内容の更新が伝搬する", () => {
        const mock = jest.fn();
        render(<TextParser setTetoriContent={mock}/>);

        expect(screen.getByRole("textbox")).toBeInTheDocument();

        fireEvent.change(screen.getByRole("textbox"), {target: {value: "foobarbaz"}});

        expect(mock.mock.calls[0][0]).toMatchObject([{dialog: "foobarbaz"}]);
    });
})