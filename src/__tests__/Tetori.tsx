import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {Tetori} from '../Tetori';

describe("NavigableDialog関連", () => {
    const contents = [
        {
            dialog: "foo",
        },
        {
            dialog: "bar",
        },
        {
            dialog: "baz",
        },
    ];

    test("前へ/次へボタン", () => {
        render(<Tetori contents={contents}/>)

        const prev = screen.getByTitle(/Previous/i);
        const next = screen.getByTitle(/Next/i);

        expect(prev).toBeVisible();
        expect(next).toBeVisible();

        expect(screen.getByText("foo")).toBeVisible();

        fireEvent.click(next)
        expect(screen.getByText("bar")).toBeVisible();
        expect(prev).toHaveTextContent("foo");

        fireEvent.click(next)
        expect(screen.getByText("baz")).toBeVisible();
        expect(prev).toHaveTextContent("bar");

        fireEvent.click(next)
        expect(screen.getByText("baz")).toBeVisible();
        expect(prev).toHaveTextContent("bar");

        fireEvent.click(prev)
        expect(screen.getByText("bar")).toBeVisible();
        expect(prev).toHaveTextContent("foo");

        fireEvent.click(prev)
        expect(screen.getByText("foo")).toBeVisible();

        fireEvent.click(prev)
        expect(screen.getByText("foo")).toBeVisible();
    })

    test("要素数が現地点より小さい場合にページを終端に合わせる", () => {
        const {rerender} = render(<Tetori contents={contents.slice(0, 3)}/>)
        const next = screen.getByTitle(/Next/i);

        fireEvent.click(next);
        fireEvent.click(next);
        expect(screen.getByText("baz")).toBeVisible();

        rerender(<Tetori contents={contents.slice(0, 2)}/>)
        expect(screen.getByText("bar")).toBeVisible();
    })

    test("空配列から要素が追加された場合最初の要素に移動する", () => {
        const {rerender} = render(<Tetori contents={[]}/>)
        expect(screen.queryByText("foo")).toBeNull();
        expect(screen.queryByText("bar")).toBeNull();
        expect(screen.queryByText("baz")).toBeNull();

        rerender(<Tetori contents={contents}/>)
        expect(screen.getByText("foo")).toBeVisible();
    })
})