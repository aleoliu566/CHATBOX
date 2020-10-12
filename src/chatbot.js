import React from 'react';
import './App.css';
import firebase from 'firebase';
import config from './config';

class Chatbot extends React.Component{
  constructor(props) {
    super(props);

    this.state={
      chatContent: {},
      value: '',
      userName: '',
    }

    this.handleChangeName = this.handleChangeName.bind(this);
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
        this.setState({ chatContent: e.val() });
      });
    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleChangeName(event) {
    this.setState({userName: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.value !== "" && this.state.value !== "") {
      this.sendMessege();
    }
  }

  handleKeyDown(event) {
    if(event.key === 'Enter' && this.state.value !== "") {
      this.sendMessege();      
    }
  }

  sendMessege() {
    let messege = this.state.userName + ": " + this.state.value;
    var dt = new Date();
    this.firebaseApp.database().ref('/Test').push({
      content:this.state.userName + ': ' + this.state.value,
      time: dt.getFullYear() + '/'
          + (parseInt(dt.getMonth())+1) + '/'
          + dt.getDate() + '-'
          + dt.getHours() + ':'
          + dt.getMinutes() + ':'
          + dt.getSeconds(),
      user: this.state.userName
    });
    this.setState({value: ''});
  }

  isUser(contentUser) {
    console.log(contentUser);
    if(contentUser === this.state.userName) {
      return 'contentRight';
    } else {
      return 'contentLeft';
    }
  }

  render(){
    let chatbot = Object.keys(this.state.chatContent).map(key => 
      <p value={key} className={this.isUser(this.state.chatContent[key].user)}>
        {this.state.chatContent[key].content}
        <span className="chatTime">
          {this.state.chatContent[key].time}
        </span>
      </p>
    )

    return (
      <div className="App">
        <div className="chatContentBox">
          {chatbot}
        </div>      
        <div className="chatSubmitBox">
          <input type="text" value={this.state.userName} onChange={this.handleChangeName} />
          <input type="text" value={this.state.value} onChange={this.handleChange}  onKeyPress={this.handleKeyDown}/>
          <input type="submit" value="Submit" onClick={this.handleSubmit}/>
        </div>
      </div>
    );
  }
}

export default Chatbot;