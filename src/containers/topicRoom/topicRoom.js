import React, {Component} from 'react';
import './topicRoom.css'
import axios from 'axios'
import {withRouter} from "react-router-dom";

class topicRoom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '',
            user_name: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.keyPressedEnter = this.keyPressedEnter.bind(this);
        this.userCreate = this.userCreate.bind(this);
        this.userKeyPressedEnter = this.userKeyPressedEnter.bind(this)
        this.userHandleChange = this.userHandleChange.bind(this)
    }


    async componentDidMount() {
        const user_name = localStorage.getItem('user_name');

        if (user_name) {
            const id = this.props.location.state.id;
            const getMessages = await axios.get(`https://guest-book-node.herokuapp.com/message/${id}`);
            console.log(getMessages);
            if (getMessages) {
                this.setState({messages: getMessages.data.msg});
            }
        }
    };



    async handleSubmit(event) {
        event.preventDefault();
        const {text} = this.state;
        const date = new Date();
        const topic_id = this.props.location.state.id;
        const user_name = localStorage.getItem('user_name');

        const post = await axios.post('https://guest-book-node.herokuapp.com/message/save', {text, date, topic_id, user_name});

        if (post) {
            this.setState({text: ''});
            const mesagges = this.state.messages;
            mesagges.unshift(post.data.msg);
            console.log(mesagges);
            this.setState({messages: mesagges})
        }

    }

    keyPressedEnter(event) {
        if (event.key === "Enter") {
            this.handleSubmit(event)
        }
    }

    handleChange(event) {
        this.setState({text: event.target.value});

    }

    renderMessages({id, text, date, user_name}) {

        return (
            <div key={id} className={'topicRoom__messageList__message'}>
                <div className={'aboutUser'}>
                    <img src="" alt="UserLogo" className={'aboutUser__userLogo'}/>
                    <p>{user_name}</p>
                </div>

                <div className={'message'}>
                    <span className={'date'}>{date}</span>
                    <p className={'text'}>{text}</p>
                </div>
            </div>
        )
    }

    //Create user nickname
    // we need this, because we haven't authorization on our back end
    userCreate(event) {
        event.preventDefault();
        localStorage.setItem('user_name', this.state.user_name);

        this.setState({user_name: ''});
        window.location.reload()
    }

    userKeyPressedEnter(event) {
        if (event.key === "Enter") {
            this.userCreate(event)
        }
    }

    userHandleChange(event) {

        this.setState({user_name: event.target.value});
    }

    render() {

        const {messages} = this.state;

        if (messages) {
            return (
                <div className={'topicRoom'}>

                    <div className={'topicRoom__messageForm'}>
                        <form className={'topicRoom__messageForm__form'} onSubmit={this.handleSubmit}
                              onKeyPress={this.keyPressedEnter}>
                            <textarea placeholder={'Your message'} className={'customInput'}
                                      value={this.state.text} onChange={this.handleChange}/>
                            <input type="submit" value={'Send'} className={'button'}/>
                        </form>
                    </div>
                    <div className={'topicRoom__messageList'}>
                        {messages.map(this.renderMessages, this)}
                    </div>
                </div>
            )
        }
        //Create user nickname
        return (
            <div className={'authUser'}>
                <p>Write your nickname</p>
                <div className={'topicRoom__messageForm'}>
                    <form className={'topicRoom__messageForm__form'} onSubmit={this.userCreate}
                          onKeyPress={this.userKeyPressedEnter}>
                            <textarea placeholder={'Your nickname'} className={'customInput'}
                                      value={this.state.user_name} onChange={this.userHandleChange}/>
                        <input type="submit" value={'Create'} className={'button'}/>
                    </form>
                </div>
            </div>
        )

    }

}

export default withRouter(topicRoom)