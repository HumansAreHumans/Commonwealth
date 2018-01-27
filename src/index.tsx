import * as React from 'react';
import * as ReactDOM from 'react-dom';
import GameState from './GameState';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import './vis';

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();