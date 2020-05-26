import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import Recipes from './pages/Recipes';
import SavedRecipes from './pages/SavedRecipe';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Workouts from './pages/Workouts';
import Profile from './pages/Profile/index';
import Post from './pages/Post';
import API from './utils/API';
import NavMenu from './components/NavMenu';
import PublicProfile from './pages/PublicProfile';
import Social from './pages/Social';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      username: '',
      id: null,
      redirectTo: null,
    };

    this.getUser = this.getUser.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    this.getUser();
  }

  updateUser(userObject) {
    this.setState(userObject);
  }

  getUser() {
    API.checkLogin().then(response => {
      if (response.data.user) {
        this.setState({
          username: response.data.user.username,
          id: response.data.user._id,
          loggedIn: true,
        });
      } else {
        this.setState({
          loggedIn: false,
          username: null,
          id: null,
        });
      }
    });
  }

  render() {
    if (this.state.loggedIn) {
      return (
        <div className="App">
          <NavMenu
            id={this.state.id}
            updateUser={this.updateUser}
            loggedIn={this.state.loggedIn}
          />
          <Route
            exact
            path="/"
            render={() => (
              <Home
                getUser={this.getUser}
                loggedIn={this.state.loggedIn}
                id={this.state.id}
              />
            )}
          />
          <Route
            exact
            path="/home"
            render={() => (
              <Home
                getUser={this.getUser}
                loggedIn={this.state.loggedIn}
                id={this.state.id}
              />
            )}
          />
          <Route
            exact
            path="/profile"
            render={() => <Profile getUser={this.getUser} id={this.state.id} />}
          />
          <Route
            exact
            path="/users/:slug"
            render={() => <PublicProfile id={this.state.id} />}
          />
          <Route path="/posts/:id" render={() => <Post id={this.state.id} />} />
          <Route
            exact
            path="/recipes"
            render={() => <Recipes id={this.state.id} />}
          />
          <Route
            exact
            path="/savedrecipes"
            render={() => <SavedRecipes id={this.state.id} />}
          />
          <Route
            exact
            path="/workouts"
            currentUser={this.state.username}
            render={() => <Workouts id={this.state.id} />}
          />
          <Route
            exact
            path="/social"
            render={() => <Social id={this.state.id} />}
          />
          <Footer />
        </div>
      );
    } else {
      return (
        <div className="App">
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route
            exact
            path="/login"
            render={() => <Login updateUser={this.updateUser} />}
          />
          {/* <Route exact path="/register" component={Register} /> */}
          <Route exact path="/register" render={() => <Register />} />

          <Footer />
        </div>
      );
    }
  }
}

export default App;
