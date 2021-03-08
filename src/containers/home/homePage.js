import React, {Component} from 'react';
import axios from 'axios'

import './homePage.css';
import {withRouter} from "react-router-dom";

class homePage extends Component {

    constructor(props) {
        super(props);
        this.state = {text: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.keyPressedEnter = this.keyPressedEnter.bind(this);

    }

    async componentDidMount() {
        const topics = await axios.get('https://guest-book-node.herokuapp.com/topic');

        if (topics) {
            this.setState(topics.data)
        }

    }
    async handleSubmit(event) {
        event.preventDefault();
        const {text} = this.state;
        const post = await axios.post('https://guest-book-node.herokuapp.com/topic/create', {text});


        if (post){
            this.setState({text: ''});
            const msg = this.state.msg;
            msg.unshift(post.data.msg);
            this.setState({msg: msg})
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

    topicRender({id, text}) {

        return (

            <div key={id} className={'homePage_topicList_topic'} onClick={() => this.props.history.push({
                pathname: '/topic',
                state: {id}
            })}>

                <img src="" alt="TopicLogo" className={'topicLogo'}/>
                <p className={'topicDescription'}>
                    {text}
                </p>
            </div>
        )
    }

    render() {
        const {msg} = this.state;

        if (msg) {
            return (
                <div className={'homePage'}>
                    <div className={'homePage__createTopic'}>
                        <h1>Choose topic or create new</h1>
                        <div>
                            <div className={'topicRoom__messageForm'}>
                                <form className={'topicRoom__messageForm__form'} onSubmit={this.handleSubmit}
                                      onKeyPress={this.keyPressedEnter}>
                            <textarea placeholder={'Topic name'} className={'customInput'}
                                      value={this.state.text} onChange={this.handleChange}/>
                                    <input type="submit" value={'Create'} className={'button'}/>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className={'homePage_topicList'}>
                        {msg.map(this.topicRender, this)}
                    </div>

                </div>
            )
        }
        return (
            <div>

            </div>
        )


    }

}

export default withRouter(homePage)