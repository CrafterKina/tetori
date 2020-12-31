import {parse} from "../TextParser"

describe("text parsing", () => {
    test("空の文字列であれば空の配列を生成する", () => {
        expect(parse("")).toEqual([]);
    });

    test("改行を含まない文字列はその文字列をdialogに持つObjectただひとつを要素とする配列を生成する", () => {
        expect(parse("foobarbaz")).toMatchObject([{dialog: "foobarbaz"}])
        expect(parse("ほげふが")).toMatchObject([{dialog: "ほげふが"}])
        expect(parse("foo<br>bar<br>baz")).toMatchObject([{dialog: "foo<br>bar<br>baz"}])
        expect(parse("foo\\nbar\\nbaz")).toMatchObject([{dialog: "foo\\nbar\\nbaz"}])
    })

    test("文字列の改行ごとに要素は分割される", () => {
        expect(parse("foo\nbar\nbaz")).toMatchObject([
            {dialog: "foo"},
            {dialog: "bar"},
            {dialog: "baz"}
        ])
    })
})