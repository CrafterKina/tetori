import React, {useState} from 'react';
import {TextParser} from "./TextParser";
import {Tetori, TetoriContent} from "./Tetori";

function App() {
    const [content, setContent] = useState<TetoriContent>([]);

    return (
        <div className="App">
            <TextParser setTetoriContent={(content) => {
                setContent(Object.assign({}, content, {content: content}))
            }}/>
            <Tetori contents={content}/>
        </div>
    );
}

export default App;
