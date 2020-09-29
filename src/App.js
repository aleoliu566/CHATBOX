import React from 'react';
import './App.css';
import Chatbot from './chatbot';

export default class App extends React.Component{
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div className="App">
        <Chatbot/>
      </div>
    );
  }
}
