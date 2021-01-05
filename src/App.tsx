import React, {useState} from 'react';
import {Tetori, TetoriContent} from "./Tetori";
import {SourceSwitcher} from "./SourceSwitcher";

function App() {
    const [content, setContent] = useState<TetoriContent>([]);

    return (
        <div className="App">
            <SourceSwitcher setTetoriContent={setContent}/>
            <Tetori contents={content}/>
        </div>
    );
}

export default App;
