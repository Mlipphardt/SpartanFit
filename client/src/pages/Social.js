import React, { Component } from 'react';
import API from '../utils/API';
import PostCard from '../components/PostCard';
import {
  CardDiv,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
} from '../components/BootstrapCard';
import { Link } from 'react-router-dom';
import { InputBar, BarInput, InputBarBtn } from '../components/InputBar';
import {
  NavBarDiv,
  NavBarUl,
  NavBarLi,
  NavBarBtn,
  NavInput,
  NavBarSearch,
} from '../components/SocialNav';
import GridContainer from '../components/GridContainer';
import Moment from 'react-moment';
import PostModal from '../components/PostModal';

class Social extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      userSearchForm: '',
      postSearchForm: '',
      userSearchResults: [],
      activityFeed: [],
      userFollowing: [],
      followFeed: [],
      postSearchResults: [],
    };
  }

  componentDidMount = () => {
    //this.props.getUser(); //i don't think this was needed but leaving the reference in case
    this.setState({ id: this.props.id });
    this.loadPublicPosts();
  };

  loadPublicPosts = () => {
    API.getPosts()
      .then(res => {
        this.setState({ activityFeed: res.data });
      })
      .catch(err => console.log(err));
  };

  loadFollowing = event => {
    event.preventDefault();
    API.getUser(this.state.id)
      .then(res => {
        const following = res.data.following.map(follow => follow.userId);
        const followFeed = this.state.activityFeed.filter(post => {
          if (following.indexOf(post.userId) >= 0) {
            return post;
          }
        });
        this.setState({ userFollowing: following, activityFeed: followFeed });
      })
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    let value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value,
    });
  };

  handleUserSearchClick = event => {
    event.preventDefault();
    API.findUsers(this.state.userSearchForm)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            userSearchResults: res.data,
          });
        }
      })
      .catch(err => console.log(err));
  };

  handlePostSearch = event => {
    event.preventDefault();
    API.postTextSearch(this.state.postSearchForm)
      .then(res => {
        this.setState({ postSearchResults: res.data, activityFeed: res.data });
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      //profile-page css is also good for this
      <div className="profile-page">
        <GridContainer style={{ gridTemplateColumns: '1fr 30%' }}>
          <div>
            <h4>Activity</h4>
            <hr></hr>
            <NavBarDiv>
              <div className="collapse navbar-collapse">
                <NavBarUl>
                  <NavBarLi
                    style={{ cursor: 'pointer' }}
                    onClick={this.loadPublicPosts}
                  >
                    <div>
                      <i class="fas fa-globe-americas"></i> Public Feed
                    </div>
                  </NavBarLi>
                  <NavBarLi style={{ cursor: 'pointer' }}>
                    <div onClick={event => this.loadFollowing(event)}>
                      <i class="fas fa-user-friends"></i> Social Feed
                    </div>
                  </NavBarLi>
                  <NavBarLi>
                    <PostModal
                      id={this.props.id}
                      postWallId={this.props.id}
                      loadPosts={this.loadPublicPosts}
                    />
                  </NavBarLi>
                </NavBarUl>
                <NavBarSearch value={this.state.activitySearch}>
                  <NavInput
                    placeHolder={'Search SpartanFit Social'}
                    style={{ width: 300 }}
                    onChange={this.handleInputChange}
                    name="postSearchForm"
                    value={this.state.postSearchForm}
                    type="text"
                  />
                  <NavBarBtn
                    onClick={event => this.handlePostSearch(event)}
                    type="submit"
                    label="Explore"
                  />
                </NavBarSearch>
              </div>
            </NavBarDiv>
            {this.state.activityFeed.map(post => {
              return (
                <CardDiv key={post._id}>
                  <CardBody>
                    <GridContainer style={{ gridTemplateColumns: '10% 1fr' }}>
                      <Link to={'/users/' + post.username}>
                        <div id="postImgDiv">
                          <img
                            id="postImg"
                            src={post.userpic}
                            alt="profile-pic"
                          />
                        </div>
                      </Link>
                      <div>
                        <GridContainer
                          style={{ gridTemplateColumns: '1fr 200px ' }}
                        >
                          <CardTitle>
                            {post.firstName} {post.lastName}
                          </CardTitle>
                          <CardSubtitle>
                            <Moment
                              format="MM/DD/YYYY hh:mm a"
                              date={post.createdAt}
                            />
                          </CardSubtitle>
                        </GridContainer>

                        <CardText>{post.postBody}</CardText>
                        <Link
                          to={'/posts/' + post._id}
                          style={{ textDecoration: 'none', color: 'black' }}
                        >
                          <i class="far fa-comments"></i> (
                          {post.comments.length})
                        </Link>
                      </div>
                    </GridContainer>
                  </CardBody>
                </CardDiv>
              );
            })}
          </div>
          <div>
            <h4>Find people</h4>
            <hr></hr>
            <InputBar>
              <BarInput
                placeHolder="Find other SpartanFit Warriors"
                onChange={this.handleInputChange}
                name="userSearchForm"
                value={this.state.userSearchForm}
                type="text"
              />
              <InputBarBtn
                onClick={event => this.handleUserSearchClick(event)}
                label="Go"
              />
            </InputBar>
            {this.state.userSearchResults.map(user => (
              <CardDiv>
                <PostCard
                  key={user._id}
                  id={user._id}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  image={
                    user.image[0] === undefined
                      ? 'https://spartanfit.s3.us-east-2.amazonaws.com/1590371866852'
                      : user.image[0].profileImg
                  }
                  username={user.slug}
                >
                  {user.state ? (
                    <div className="card-text mb-1">
                      {user.city}, {user.state}
                    </div>
                  ) : (
                    <div className="card-text mb-1">{user.state}</div>
                  )}
                  <div className="card-text mb-1">{user.bio}</div>
                </PostCard>
              </CardDiv>
            ))}
          </div>
        </GridContainer>
      </div>
    );
  }
}

export default Social;
