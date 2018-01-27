import * as React from 'react';
import './App.css';
import GameUI from './GameUI';

class App extends React.Component {
  render() {
    return ( 
        <div className="App">
            <GameUI />
        </div> 
    );
  }
}

export default App;
