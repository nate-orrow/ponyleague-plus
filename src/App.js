// src/App.js

import React from 'react';
import Rosters from './Rosters';  // Ensure this line is present

const App = () => {
    return (
        <div className="App">
            <h1>Ponyleague+</h1>
            <Rosters />  {/* Render Rosters component here */}
        </div>
    );
};

export default App;