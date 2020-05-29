import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import API from '../../utils/API';
import { Link } from 'react-router-dom';
import { Col, Row } from '../../components/Grid';
import './style.css';
import Alert from '../../components/Alert';
import {
  CardDiv,
  CardBody,
  CardTitle,
  CardText,
} from '../../components/BootstrapCard';
import thumb from '../../images/thumb.png';
import Btn from '../../components/Btn';
import PostCard from '../../components/PostCard';

class PublicProfile extends Component {
  constructor(props) {
    super(props);
    this.route = window.location.pathname;
    this.state = {
      id: '',
      userId: '',
      user: '',
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      city: '',
      state: '',
      joinDate: '',
      bio: '',
      interests: '',
      currentWeight: null,
      goalWeight: null,
      show: false,
      variant: undefined,
      message: '',
      hover: false,
      following: null,
      imageUrl: '',
      posts: [],
      lurkerData: null,
      redirectTo: null,
      occupation: null,
    };
  }

  componentWillMount = () => {
    this.setState({ id: this.props.id });
    this.loadUserdata();
    this.loadLurkerData();
  };

  loadUserdata = () => {
    API.getPublicProfile(this.route).then((res, err) => {
      if (err) {
        console.log(err);
      }
      if (res.data[0] === undefined) {
        this.setState({ redirectTo: '/' });
      } else {
        this.setState({
          user: res.data[0],
          userId: res.data[0]._id,
          username: res.data[0].slug,
          firstName: res.data[0].firstName,
          lastName: res.data[0].lastName,
          email: res.data[0].email,
          city: res.data[0].city,
          state: res.data[0].state,
          joinDate: res.data[0].createdAt,
          bio: res.data[0].bio,
          interests: res.data[0].interests,
          currentWeight: res.data[0].currentWeight,
          goalWeight: res.data[0].goalWeight,
          imageUrl: res.data[0].image[0]
            ? res.data[0].image[0].profileImg
            : thumb,
          posts: res.data[0].posts,
          occupation: res.data[0].occupation,
        });
      }
    });
  };

  loadLurkerData = () => {
    API.getUser(this.props.id).then((res, err) => {
      if (err) {
        console.log(err);
      }
      const lurkerFollows = res.data.following;
      let following;
      if (lurkerFollows.some(follow => follow.userId === this.state.userId)) {
        following = true;
      } else {
        following = false;
      }
      this.setState({
        lurkerData: res.data,
        following: following,
      });
    });
  };

  handleFollowClick = event => {
    event.preventDefault();
    //cant follow yourself
    if (this.state.id === this.state.userId) {
      const show = true;
      const message = 'You cannot follow yourself';
      const variant = 'danger';
      this.setState({ show: show, message: message, variant: variant });
    } else {
      API.followUser(this.state.id, {
        username: this.state.username,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        userId: this.state.userId,
        followerId: this.state.lurkerData._id,
        followerfirstName: this.state.lurkerData.firstName,
        followerlastName: this.state.lurkerData.lastName,
        followerUserName: this.state.lurkerData.slug,
      })
        .then(res => {
          if (res.status === 200) {
            const show = true;
            const message = 'You are now following ' + this.state.username;
            const variant = 'success';
            this.setState({ show: show, message: message, variant: variant });
            // this.setState({
            //   commentBody: '',
            // });
            this.componentDidMount();
          }
        })
        .catch(err => console.log(err));
    }
  };

  handleUnfollowClick = () => {
    const following = this.state.lurkerData.following;
    let followId;
    following.forEach(follow => {
      if (follow.userId === this.state.userId) {
        followId = follow._id;
      }
    });
    console.log(followId);
    //var index = this.state.lurkerData.following.some(this.state.userId);
    API.unfollowUser(followId)
      .then(res => {
        this.componentDidMount();
        const show = true;
        const message = 'You unfollowed ' + this.state.username;
        const variant = 'danger';
        this.setState({ show: show, message: message, variant: variant });
      })
      .catch(err => console.log(err));
  };

  toggleHover = () => {
    this.setState({ hover: !this.state.hover });
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />;
    } else {
      return (
        <div className="profile-page">
          <Alert
            show={this.state.show}
            message={this.state.message}
            variant={this.state.variant}
          />
          <CardDiv>
            <CardBody>
              <CardTitle>
                {this.state.firstName} {this.state.lastName}
              </CardTitle>
              <Row style={{ padding: 0, margin: 0 }}>
                <Col size="lg-3">
                  <div className="profile-img">
                    <img
                      src={process.env.PUBLIC_URL + this.state.imageUrl}
                      alt=""
                    />
                  </div>
                </Col>
                <Col size="lg-6">
                  <CardText>
                    <Row>
                      <Col size="lg-5">
                        <Row>
                          <Col size="md-3">
                            <label>ID</label>
                          </Col>
                          <Col size="md-7">
                            <p>{this.state.username}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col size="md-3">
                            <label>Name</label>
                          </Col>
                          <Col size="md-7">
                            <p>
                              {this.state.firstName} {this.state.lastName}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col size="md-3">
                            <label>Email</label>
                          </Col>
                          <Col size="md-7">
                            <p>{this.state.email}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col size="md-3">
                            <label>Location</label>
                          </Col>
                          <Col size="md-7">
                            <p>
                              {this.state.city}, {this.state.state}
                            </p>
                          </Col>
                          <Col size="md-3">
                            <label>Job</label>
                          </Col>
                          <Col size="md-7">
                            <p>{this.state.occupation}</p>
                          </Col>
                        </Row>
                      </Col>
                      <Col size="lg-7">
                        <Row>
                          <Col size="md-4">
                            <label>Weight</label>
                          </Col>
                          <Col size="md-8">
                            <p>{this.state.currentWeight}</p>
                          </Col>
                          <Col size="md-4">
                            <label>Goal</label>
                          </Col>
                          <Col size="md-8">
                            <p>{this.state.goalWeight}</p>
                          </Col>
                          <Col size="md-4">
                            <label>Interests</label>
                          </Col>
                          <Col size="md-8">
                            <p>{this.state.interests}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col size="md-4">
                            <label>Bio</label>
                          </Col>
                          <Col size="md-8">
                            <p>{this.state.bio}</p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </CardText>
                </Col>
                <Col size="lg-3">
                  <div className="edit-btn">
                    {this.state.following ? (
                      <Btn
                        className={
                          this.state.hover
                            ? 'btn btn-danger btn-sm'
                            : 'btn btn-primary btn-sm'
                        }
                        id="following"
                        label={this.state.hover ? 'unfollow' : 'following'}
                        style={{ borderRadius: '1.5rem' }}
                        onMouseEnter={this.toggleHover}
                        onMouseLeave={this.toggleHover}
                        onClick={this.handleUnfollowClick}
                      />
                    ) : (
                      <Btn
                        className="btn btn-outline-primary btn-sm"
                        label="follow"
                        id="following"
                        style={{ borderRadius: '1.5rem' }}
                        onClick={event => this.handleFollowClick(event)}
                      />
                    )}
                  </div>
                </Col>
              </Row>
              <hr></hr>
              <div>
                <h4>Posts</h4>
              </div>

              <hr></hr>
              {this.state.posts.length ? (
                <div>
                  {this.state.posts.map(post => (
                    <CardDiv>
                      <PostCard
                        key={post._id}
                        id={post._id}
                        firstName={post.firstName}
                        lastName={post.lastName}
                        image={post.userpic}
                        username={post.username}
                        postBody={post.postBody}
                        createdAt={post.createdAt}
                      >
                        <Link
                          to={'/posts/' + post._id}
                          style={{ textDecoration: 'none', color: 'black' }}
                        >
                          <i class="far fa-comments"></i> (
                          {post.comments.length})
                        </Link>
                      </PostCard>
                    </CardDiv>
                  ))}
                </div>
              ) : (
                <h3>No Posts to Display</h3>
              )}
            </CardBody>
          </CardDiv>
        </div>
      );
    }
  }
}

export default PublicProfile;
