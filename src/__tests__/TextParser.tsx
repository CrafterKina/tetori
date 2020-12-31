import {parse} from "../TextParser"

describe("text parsing", () => {
    test("空の文字列であれば空の配列を生成する", () => {
        expect(parse("")).toEqual([]);
    });
})