import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Row } from '../../components/Grid';
import { Link } from 'react-router-dom';
import Notifications from '../../components/Popover';
import API from '../../utils/API';
import './style.css';

class NavMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      redirectTo: null,
      notifications: [],
    };
    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    this.setState({ id: this.props.id });
    this.loadUserNotifications();
    setTimeout(() => {
      this.componentWillMount();
    }, 3000);
  }

  loadUserNotifications = () => {
    API.getUser(this.props.id).then((res, err) => {
      if (err) {
        console.log(err);
      }
      this.setState({
        notifications: res.data.notifications,
      });
    });
  };

  deleteNotification = id => {
    API.deleteNotification(id)
      .then(res => this.componentWillMount())
      .catch(err => console.log(err));
  };

  logout(event) {
    event.preventDefault();
    console.log('logging out');
    API.logout()
      .then(response => {
        if (response.status === 200) {
          this.setState({
            redirectTo: '/',
          });
          this.props.updateUser({
            loggedIn: false,
            username: null,
          });
        }
      })
      .catch(error => {
        console.log('Logout error');
      });
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />;
    } else {
      return (
        <div>
          <div className="jumbotron jumbotron-fluid">
            <div className="container">
              <h1 className="topleft">
                Spartan<span class="text-info">Fit</span>
              </h1>
              <div className="links" id="icon-links">
                <Row>
                  <div id="notification-container">
                    <Notifications
                      notifications={this.state.notifications}
                      deleteNotification={id => this.deleteNotification(id)}
                    />
                    <span class="badge badge-pill badge-danger" id="badge">
                      {this.state.notifications.length
                        ? this.state.notifications.length
                        : null}
                    </span>
                  </div>

                  <Link
                    to="/"
                    className={
                      window.location.pathname === '/' ||
                      window.location.pathname === '/home'
                        ? 'home-link active'
                        : 'home-link'
                    }
                  >
                    <i class="fas fa-home"></i>
                  </Link>
                  <Link
                    to="/profile"
                    className={
                      window.location.pathname === '/profile'
                        ? 'profile-link active'
                        : 'profile-link'
                    }
                  >
                    <i class="far fa-id-card"></i>
                  </Link>
                  <Link
                    to="/workouts"
                    className={
                      window.location.pathname === '/workouts'
                        ? 'workouts-link active'
                        : 'workouts-link'
                    }
                  >
                    <i class="fas fa-dumbbell"></i>
                  </Link>
                  <div
                    className={
                      window.location.pathname === '/recipes' ||
                      window.location.pathname === '/savedrecipes'
                        ? 'dropdown active'
                        : 'dropdown recipes-link'
                    }
                  >
                    <div
                      className="dropdown"
                      //this adds an arrowm not sure which one looks better
                      //className="dropdown-toggle"
                      id="navbarDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      style={{ cursor: 'pointer' }}
                    >
                      <i class="fas fa-hamburger"></i>
                    </div>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <Link className="dropdown-item" to="/savedrecipes">
                        My Recipes
                      </Link>
                      <Link to="/recipes" className="dropdown-item">
                        <span className="text-secondary">Search Recipes</span>
                      </Link>
                    </div>
                  </div>
                  <Link
                    to="/social"
                    className={
                      window.location.pathname === '/social'
                        ? 'workouts-link active'
                        : 'workouts-link'
                    }
                  >
                    <i class="fas fa-users"></i>
                  </Link>
                  <Link className="logout-link" to="/" onClick={this.logout}>
                    <i class="fas fa-sign-out-alt"></i>
                  </Link>
                </Row>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default NavMenu;
