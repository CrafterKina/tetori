import {splitPlainText} from "../PlainTextParser";

describe("オプション付きのプレーンテキストのパーズ", () => {
    test("すべてのオプションがfalseなら一切の分割を行わない", () => {
        expect(splitPlainText({
            text: "foo\n\nbar\nbaz\nqux",
            blanks: 0,
            lines: 0,
            allowEmpty: true,
            allowEmptyLine: true,
        })).toEqual(["foo\n\nbar\nbaz\nqux"]);
    });

    test("blanksに指定された数以上の空行で分割を行う", () => {
        expect(splitPlainText({
            text: "foo\n\n\nbar\n\nbaz\nqux",
            blanks: 1,
            lines: 0,
            allowEmpty: true,
            allowEmptyLine: true,
        })).toEqual(["foo", "bar", "baz\nqux"]);

        expect(splitPlainText({
            text: "foo\n\n\nbar\n\nbaz\nqux",
            blanks: 2,
            lines: 0,
            allowEmpty: true,
            allowEmptyLine: true,
        })).toEqual(["foo", "bar\n\nbaz\nqux"]);

        expect(splitPlainText({
            text: "foo\n\n\nbar\n\nbaz\nqux",
            blanks: 3,
            lines: 0,
            allowEmpty: true,
            allowEmptyLine: true,
        })).toEqual(["foo\n\n\nbar\n\nbaz\nqux"]);
    });

    test("linesに指定された数以上の行が存在すれば分割する", () => {
        expect(splitPlainText({
            text: "foo\n\n\nbar\n\nbaz\nqux",
            blanks: 0,
            lines: 1,
            allowEmpty: true,
            allowEmptyLine: true,
        })).toEqual(["foo", "", "", "bar", "", "baz", "qux"]);

        expect(splitPlainText({
            text: "foo\n\n\nbar\n\nbaz\nqux",
            blanks: 2,
            lines: 0,
            allowEmpty: true,
            allowEmptyLine: true,
        })).toEqual(["foo", "bar\n\nbaz\nqux"]);

        expect(splitPlainText({
            text: "foo\n\n\nbar\n\nbaz\nqux",
            blanks: 3,
            lines: 0,
            allowEmpty: true,
            allowEmptyLine: true,
        })).toEqual(["foo\n\n\nbar\n\nbaz\nqux"]);
    });


    test("allowEmptyでなければ空の要素は存在しない", () => {
        expect(splitPlainText({
            text: "",
            blanks: 0,
            lines: 1,
            allowEmpty: true,
            allowEmptyLine: true,
        })).toEqual([""]);

        expect(splitPlainText({
            text: "",
            blanks: 0,
            lines: 1,
            allowEmpty: false,
            allowEmptyLine: true,
        })).toEqual([]);

        expect(splitPlainText({
            text: "foo\n\n\nbar\n\nbaz\nqux",
            blanks: 0,
            lines: 1,
            allowEmpty: true,
            allowEmptyLine: true,
        })).toEqual(["foo", "", "", "bar", "", "baz", "qux"]);

        expect(splitPlainText({
            text: "foo\n\n\nbar\n\nbaz\nqux",
            blanks: 0,
            lines: 1,
            allowEmpty: false,
            allowEmptyLine: true,
        })).toEqual(["foo", "bar", "baz", "qux"]);
    });

    test("allowEmptyLineでなければ空行は存在しない", () => {
        expect(splitPlainText({
            text: "\nfoo\n\nbar\nbaz\nqux\n",
            blanks: 0,
            lines: 0,
            allowEmpty: true,
            allowEmptyLine: false,
        })).toEqual(["foo\nbar\nbaz\nqux"]);
    })
});

export {}