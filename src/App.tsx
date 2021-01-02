import React, {useState} from 'react';
import {TextParser} from "./TextParser";
import {DialogBox} from "./DialogBox";

export interface TetoriPage {
    dialog: string
}

export type TetoriContent = Array<TetoriPage>

type State = {
    content: TetoriContent,
    pageIndex: number
}

function App() {
    const [state, setState] = useState<State>({content: [], pageIndex: 0});

    return (
        <div className="App">
            <TextParser setTetoriContent={(content) => {
                setState(Object.assign({}, state, {content: content}))
            }}/>
            {state.content[state.pageIndex] ? <DialogBox content={state.content[state.pageIndex].dialog}/> : ""}
        </div>
    );
}

export default App;
