import React, {useState} from 'react';
import {TextParser} from "./TextParser";

export interface TetoriPage {

}

export type TetoriContent = Array<TetoriPage>

function App() {
    const [state, setState] = useState<{ content: TetoriContent }>({content: []});

    return (
        <div className="App">
            <TextParser setTetoriContent={(content) => {
                setState({content: content})
            }}/>
        </div>
    );
}

export default App;
