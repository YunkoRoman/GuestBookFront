import React, {Component} from 'react';
import {
    Switch,
    Route, withRouter
} from "react-router-dom";
import HomePage from '../../containers/home'
import TopicRoom from '../../containers/topicRoom'
import './App.css';



class App extends Component {


    render() {
        return (
            <Switch>
                <Route path={'/'} exact>
                    <HomePage/>
                </Route>
                <Route path={'/topic'}>
                    <TopicRoom/>
                </Route>
            </Switch>
        )
    }

}

export default withRouter(App)

