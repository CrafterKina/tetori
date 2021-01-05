import {parsePlainText} from "../SourceSwitcher";

describe("プレーンテキストのパーズ", () => {
    test("空の文字列であれば空の配列を生成する", () => {
        expect(parsePlainText("")).toEqual([]);
        expect(parsePlainText("")).toHaveLength(0);
    });

    test("改行を含まない文字列はその文字列をdialogに持つObjectを要素とする配列を生成する", () => {
        expect(parsePlainText("foobarbaz")).toMatchObject([{dialog: "foobarbaz"}]);
        expect(parsePlainText("ほげふが")).toMatchObject([{dialog: "ほげふが"}]);
        expect(parsePlainText("foo<br>bar<br>baz")).toMatchObject([{dialog: "foo<br>bar<br>baz"}]);
        expect(parsePlainText("foo\\nbar\\nbaz")).toMatchObject([{dialog: "foo\\nbar\\nbaz"}]);
    });

    test("改行を含まない文字列はただ一つだけ要素を持つ配列を生成する", () => {
        expect(parsePlainText("foobarbaz")).toHaveLength(1);
        expect(parsePlainText("ほげふが")).toHaveLength(1);
        expect(parsePlainText("foo<br>bar<br>baz")).toHaveLength(1);
        expect(parsePlainText("foo\\nbar\\nbaz")).toHaveLength(1);
    });

    test("文字列の改行ごとに要素は分割される", () => {
        expect(parsePlainText("foo\nbar\nbaz")).toMatchObject([
            {dialog: "foo"},
            {dialog: "bar"},
            {dialog: "baz"}
        ]);
        expect(parsePlainText("foo\nbar\nbaz")).toHaveLength(3);
    });

    test("dialogが空文字列の要素は生成しない", () => {
        expect(parsePlainText("\n")).toEqual([]);
        expect(parsePlainText("\n")).toHaveLength(0);
        expect(parsePlainText("foo\n\nbar")).toMatchObject([
            {dialog: "foo"},
            {dialog: "bar"}
        ]);
        expect(parsePlainText("foo\n\nbar")).toHaveLength(2);
    });
});