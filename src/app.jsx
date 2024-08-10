import React from 'react';
import {createRoot} from 'react-dom/client';

function App() {
    return (
        <div>
            <h1>欢迎来到我的首个全栈应用</h1>
            <button>按钮</button>
        </div>
    );
}

const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(<App />);

console.log('eslint testing');