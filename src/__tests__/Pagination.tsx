import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import {Pagination} from "../Pagination";

describe("Pagination機能はArray要素を移動する機能を持つ", () => {
    test("前へ/次へボタン", () => {
        const array = [0, 1, 2]
        const handlePageChange = jest.fn()

        render(<Pagination paginateObjects={array} initialPosition={0} handlePageChange={handlePageChange}/>);

        const prev = screen.getByTitle(/Previous/i);
        const next = screen.getByTitle(/Next/i);

        expect(prev).toBeInTheDocument();
        expect(next).toBeInTheDocument();

        // 初期化コールが走る
        expect(handlePageChange).toHaveBeenCalledTimes(1);
        expect(handlePageChange).toHaveBeenLastCalledWith(0);

        fireEvent.click(next);
        expect(handlePageChange).toHaveBeenCalledTimes(2);
        expect(handlePageChange).toHaveBeenLastCalledWith(1);

        fireEvent.click(next);
        expect(handlePageChange).toHaveBeenCalledTimes(3);
        expect(handlePageChange).toHaveBeenLastCalledWith(2);

        // 終端に到達している
        fireEvent.click(next);
        expect(handlePageChange).toHaveBeenCalledTimes(3); // 呼ばれていない
        expect(handlePageChange).toHaveBeenLastCalledWith(2);

        fireEvent.click(prev);
        expect(handlePageChange).toHaveBeenCalledTimes(4);
        expect(handlePageChange).toHaveBeenLastCalledWith(1);

        fireEvent.click(prev);
        expect(handlePageChange).toHaveBeenCalledTimes(5);
        expect(handlePageChange).toHaveBeenLastCalledWith(0);

        // 0に到達している
        fireEvent.click(prev);
        expect(handlePageChange).toHaveBeenCalledTimes(5); // 呼ばれていない
        expect(handlePageChange).toHaveBeenLastCalledWith(0);
    })

    test("要素数が現地点より小さい場合にページを終端に合わせる", () => {
        const handlePageChange = jest.fn()

        const {rerender} = render(<Pagination paginateObjects={[0, 1, 2]} initialPosition={2}
                                              handlePageChange={handlePageChange}/>);

        // 初期化コール
        expect(handlePageChange).toHaveBeenLastCalledWith(2);

        rerender(<Pagination paginateObjects={[0, 1]} handlePageChange={handlePageChange}/>)

        // Propの変更によるコール
        expect(handlePageChange).not.toHaveBeenLastCalledWith(undefined); // undefinedには決してならない
        expect(handlePageChange).toHaveBeenLastCalledWith(1); // 現在の終端
    })

    test("初期地点は最初のrender時にしか影響しない", () => {
        const array = [0, 1, 2]
        const handlePageChange = jest.fn()

        const {rerender} = render(<Pagination paginateObjects={array} initialPosition={2}
                                              handlePageChange={handlePageChange}/>);

        // 初期化コール
        expect(handlePageChange).toHaveBeenLastCalledWith(2);

        rerender(<Pagination paginateObjects={array} initialPosition={0} handlePageChange={handlePageChange}/>)

        expect(handlePageChange).toHaveBeenLastCalledWith(2); // 変化なし
    })
})