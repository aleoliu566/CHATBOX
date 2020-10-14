import React from 'react';
import './App.css';
import firebase from 'firebase';
import config from './config';

class Chatbot extends React.Component{
  constructor(props) {
    super(props);

    this.state={
      chatBotNumber: 25,
      chatContent: {},
      value: '',
      userName: '',
      lastTimeFocus: '',
    }

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  componentDidMount() {
    if (!firebase.apps.length) {
      this.firebaseApp = firebase.initializeApp(config);
      this.database = this.firebaseApp.database();

      this.database.ref('/Test').limitToLast(this.state.chatBotNumber).on("value", e => {
        this.setState({
          chatContent: e.val(),
          lastTimeFocus: e.val()[Object.keys(e.val())[this.state.chatBotNumber-1]].timestamp
        },function(){
          let lastTimeRead = localStorage.getItem("lastTimeFocus");

          if(lastTimeRead < this.state.lastTimeFocus){
            document.title="(*) notification";
          }  
        });
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

  handleFocus(event) {
    localStorage.setItem('lastTimeFocus', this.state.lastTimeFocus);
    document.title="LEEMI";
  }

  sendMessege() {
    let timestampNow = Date.now();
    var dt = new Date();
    this.firebaseApp.database().ref('/Test').push({
      content:this.state.userName + ': ' + this.state.value,
      time: dt.getFullYear() + '/'
          + (parseInt(dt.getMonth())+1) + '/'
          + dt.getDate() + '-'
          + dt.getHours() + ':'
          + dt.getMinutes() + ':'
          + dt.getSeconds(),
      timestamp: timestampNow,
      user: this.state.userName
    });
    localStorage.setItem('lastTimeFocus', timestampNow);
    this.setState({value: ''});
  }

  isUser(contentUser) {
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
          <input type="text" value={this.state.value}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyDown}
            onFocus={this.handleFocus}
          />
          <input type="submit" value="Submit" onClick={this.handleSubmit}/>
        </div>
      </div>
    );
  }
}

export default Chatbot;