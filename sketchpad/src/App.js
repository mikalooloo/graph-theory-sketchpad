import './App.css';
import React from 'react';
import logo from './logo.svg';
import DownloadButton from './components/buttons/downloadButton';

export default function App() {
  const componentRef = React.useRef();
  
  return (
    <div className="App">
      <header className="App-header">
      <div ref={componentRef}>
        <img src={logo} className="App-logo" alt="logo" />
      </div>
        <DownloadButton downloadRef={componentRef}/>
      </header>
    </div>
  );
}
