import React from 'react';
import './App.css';
import firebase from 'firebase';
import config from './config';

class Chatbot extends React.Component{
  constructor(props) {
    super(props);

    this.state={
      chatContent: [],
      value: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    let chatbotLists = [];
    if (!firebase.apps.length) {
      this.firebaseApp = firebase.initializeApp(config);
      this.database = this.firebaseApp.database();

      this.database.ref('/Test').limitToLast(20).on("value", e => {
        this.setState({chatContent: e.val()});
        chatbotLists = e.val();
      });
    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.value !== "" && this.state.value !== "") {
      this.firebaseApp.database().ref('/Test').push(this.state.value);
      this.setState({value: ''});
    }
  }

  handleKeyDown(event) {
    if(event.key === 'Enter' && this.state.value !== "") {
      this.firebaseApp.database().ref('/Test').push(this.state.value);
      this.setState({value: ''});
    }
  }

  render(){
    let chatbot = Object.keys(this.state.chatContent).map(key => 
      <p value={key}>{this.state.chatContent[key]}</p>
    )

    return (
      <div className="App">
        <input type="text" value={this.state.value} onChange={this.handleChange}  onKeyPress={this.handleKeyDown}/>
        <input type="submit" value="Submit" onClick={this.handleSubmit}/>
        {chatbot}
      </div>
    );
  }
}

export default Chatbot;
