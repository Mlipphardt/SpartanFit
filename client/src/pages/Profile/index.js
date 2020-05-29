import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/API';
import SaveBtn from '../../components/SaveBtn';
import { Col, Row, Container } from '../../components/Grid';
import { Input, TextArea, State } from '../../components/Form';
import './style.css';
import Alert from '../../components/Alert';
import {
  CardDiv,
  CardBody,
  CardTitle,
  CardText,
} from '../../components/BootstrapCard';
import thumb from '../../images/thumb.png';
import { InputBar, BarInput, InputBarBtn } from '../../components/InputBar';
import PostCard from '../../components/PostCard';
import {
  FormModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  SubmitBtn,
  CloseBtn,
} from '../../components/BootstrapModal';
import Dropdown from '../../components/Dropdown';
import PostModal from '../../components/PostModal';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      user: null,
      username: '',
      slug: '',
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
      editProfile: false,
      show: false,
      variant: undefined,
      message: '',
      imageUrl: '',
      selectedFile: null,
      post: '',
      posts: [],
      editId: '',
      editPost: '',
      occupation: '',
    };
  }

  componentDidMount = () => {
    //this.props.getUser(); //i don't think this was needed but leaving the reference in case
    this.setState({ id: this.props.id });
    this.loadUserProfile();
  };

  loadUserProfile = () => {
    API.getUser(this.props.id).then((res, err) => {
      if (err) {
        console.log(err);
      }
      this.setState({
        user: res.data,
        id: res.data._id,
        username: res.data.username,
        slug: res.data.slug,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        email: res.data.email,
        city: res.data.city,
        state: res.data.state,
        joinDate: res.data.joinDate,
        bio: res.data.bio,
        interests: res.data.interests,
        currentWeight: res.data.currentWeight,
        goalWeight: res.data.goalWeight,
        imageUrl: res.data.image[0] ? res.data.image[0].profileImg : thumb,
        likes: res.data.likes,
        posts: res.data.posts,
        selectedFile: null,
        occupation: res.data.occupation,
      });
    });
  };

  handleEditClick = event => {
    event.preventDefault();
    if (this.state.editProfile) {
      API.putUser(this.state.id, {
        username: this.state.username,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        city: this.state.city,
        state: this.state.state,
        bio: this.state.bio,
        interests: this.state.interests,
        currentWeight: this.state.currentWeight,
        goalWeight: this.state.goalWeight,
        occupation: this.state.occupation,
        slug: this.state.username.toLowerCase(),
      })
        .then(res => {
          if (res.status === 200) {
            const show = true;
            const message = 'Profile updated successfully';
            const variant = 'success';
            this.setState({
              show: show,
              message: message,
              variant: variant,
              editProfile: false,
            });
            this.loadUserProfile();
          }
        })
        .catch(err => {
          console.log(err);
          const show = true;
          const message = 'Username and/or email already taken';
          const variant = 'danger';
          this.setState({
            show: show,
            message: message,
            variant: variant,
            editProfile: false,
          });
          this.loadUserProfile();
        });
    } else {
      this.setState({ editProfile: true });
    }
  };

  handleInputChange = event => {
    let value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value,
    });
  };

  fileSelectedHandler = event => {
    console.log(event.target.files[0]);
    const show = true;
    const message =
      event.target.files[0].name +
      ' is ready to upload. Press up arrow button to confirm';
    const variant = 'primary';
    this.setState({
      selectedFile: event.target.files[0],
      show: show,
      message: message,
      variant: variant,
    });
  };

  fileUploadHandler = () => {
    const fd = new FormData();
    fd.append('profileImg', this.state.selectedFile);
    API.postUserImg(this.state.id, fd)
      .then(res => {
        console.log(res);
        const show = true;
        const message = 'Profile Picture updated successfully';
        const variant = 'success';
        this.setState({ show: show, message: message, variant: variant });
        this.loadUserProfile();
      })
      .catch(err => console.log(err));
  };

  handleEditBtn = (event, id, post) => {
    event.preventDefault();
    this.setState({
      editId: id,
      editPost: post,
    });
  };

  handleEditSubmit = (event, id) => {
    event.preventDefault();
    if (this.state.editPost) {
      API.editPost(id, {
        postBody: this.state.editPost,
      })
        .then(res => this.loadUserProfile())
        .catch(err => console.log(err));
      const show = true;
      const message = 'Post updated successfully';
      const variant = 'success';
      this.setState({ show: show, message: message, variant: variant });
    }
  };

  deletePost = id => {
    API.deletePost(id)
      .then(res => this.loadUserProfile())
      .catch(err => console.log(err));
  };

  clearState = () => {
    this.setState({
      editId: '',
      editPost: '',
    });
  };

  render() {
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
                <div className="icon-container">
                  <div className="profile-img">
                    <img
                      src={process.env.PUBLIC_URL + this.state.imageUrl}
                      alt=""
                    />
                  </div>
                  <div className="icons" id="image-icons">
                    {this.state.selectedFile ? (
                      <div>
                        <i
                          className="fas fa-upload"
                          onClick={this.fileUploadHandler}
                        ></i>
                      </div>
                    ) : (
                      <div>
                        <i
                          onClick={() => this.fileInput.click()}
                          //className="fas fa-image"
                          className="fas fa-camera-retro"
                        ></i>
                        <input
                          type="file"
                          style={{ display: 'none' }}
                          onChange={this.fileSelectedHandler}
                          ref={fileInput => (this.fileInput = fileInput)}
                        />
                      </div>
                    )}
                  </div>
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
                          {this.state.editProfile ? (
                            <Input
                              value={this.state.username}
                              name="username"
                              onChange={this.handleInputChange}
                              type="text"
                            />
                          ) : (
                            <Link to={'/users/' + this.state.slug}>
                              <p>{this.state.username}</p>
                            </Link>
                          )}
                        </Col>
                      </Row>
                      <Row>
                        <Col size="md-3">
                          <label>Name</label>
                        </Col>
                        <Col size="md-7">
                          {this.state.editProfile ? (
                            <div>
                              <Input
                                value={this.state.firstName}
                                name="firstName"
                                onChange={this.handleInputChange}
                                type="text"
                              />
                              <Input
                                value={this.state.lastName}
                                name="lastName"
                                onChange={this.handleInputChange}
                                type="text"
                              />
                            </div>
                          ) : (
                            <p>
                              {this.state.firstName} {this.state.lastName}
                            </p>
                          )}
                        </Col>
                      </Row>
                      <Row>
                        <Col size="md-3">
                          <label>Email</label>
                        </Col>
                        <Col size="md-7">
                          {this.state.editProfile ? (
                            <Input
                              value={this.state.email}
                              name="email"
                              onChange={this.handleInputChange}
                              type="email"
                            />
                          ) : (
                            <p>{this.state.email}</p>
                          )}
                        </Col>
                      </Row>
                      <Row>
                        <Col size="md-3">
                          <label>Location</label>
                        </Col>
                        <Col size="md-7">
                          {this.state.editProfile ? (
                            <div>
                              <Input
                                value={this.state.city}
                                name="city"
                                onChange={this.handleInputChange}
                                type="text"
                              />
                              <State
                                value={this.state.state}
                                name="state"
                                onChange={this.handleInputChange}
                                required
                                class="form-control form-control"
                              />
                            </div>
                          ) : (
                            <p>
                              {this.state.city}, {this.state.state}
                            </p>
                          )}
                        </Col>
                        <Col size="md-3">
                          <label>Job</label>
                        </Col>
                        <Col size="md-7">
                          {this.state.editProfile ? (
                            <div>
                              <Input
                                value={this.state.occupation}
                                name="occupation"
                                onChange={this.handleInputChange}
                                type="text"
                              />
                            </div>
                          ) : (
                            <p>{this.state.occupation}</p>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col size="lg-7">
                      <Row>
                        <Col size="md-4">
                          <label>Weight</label>
                        </Col>
                        <Col size="md-8">
                          {this.state.editProfile ? (
                            <Input
                              value={this.state.currentWeight}
                              name="currentWeight"
                              onChange={this.handleInputChange}
                              type="number"
                            />
                          ) : (
                            <p>{this.state.currentWeight}</p>
                          )}
                        </Col>
                        <Col size="md-4">
                          <label>Goal</label>
                        </Col>
                        <Col size="md-8">
                          {this.state.editProfile ? (
                            <Input
                              value={this.state.goalWeight}
                              name="goalWeight"
                              onChange={this.handleInputChange}
                              type="text"
                            />
                          ) : (
                            <p>{this.state.goalWeight}</p>
                          )}
                        </Col>
                        <Col size="md-4">
                          <label>Interests</label>
                        </Col>
                        <Col size="md-8">
                          {this.state.editProfile ? (
                            <Input
                              value={this.state.interests}
                              name="interests"
                              onChange={this.handleInputChange}
                              type="text"
                            />
                          ) : (
                            <p>{this.state.interests}</p>
                          )}
                        </Col>
                      </Row>
                      <Row>
                        <Col size="md-4">
                          <label>Bio</label>
                        </Col>
                        <Col size="md-8">
                          {this.state.editProfile ? (
                            <TextArea
                              value={this.state.bio}
                              name="bio"
                              onChange={this.handleInputChange}
                              type="text"
                            />
                          ) : (
                            <p>{this.state.bio}</p>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardText>
              </Col>
              <Col size="lg-3">
                <div className="edit-btn">
                  {this.state.editProfile ? (
                    <SaveBtn onClick={this.handleEditClick} label="Update" />
                  ) : (
                    <SaveBtn
                      onClick={this.handleEditClick}
                      label="Edit Profile"
                    />
                  )}
                </div>
              </Col>
            </Row>
            <hr></hr>
            <h4>Posts</h4>
            <PostModal
              id={this.props.id}
              postWallId={this.props.id}
              loadPosts={this.loadUserProfile}
            />
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
                    >
                      <Dropdown>
                        <div
                          className="dropdown-item"
                          data-toggle="modal"
                          data-target="#editModal"
                          onClick={event =>
                            this.handleEditBtn(event, post._id, post.postBody)
                          }
                        >
                          Edit
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={() => this.deletePost(post._id)}
                        >
                          {' '}
                          Delete
                        </div>
                      </Dropdown>

                      <Link
                        to={'/posts/' + post._id}
                        style={{ textDecoration: 'none', color: 'black' }}
                      >
                        <i class="far fa-comments"></i> ({post.comments.length})
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
        <FormModal id={'editModal'} clearState={this.clearState}>
          <ModalHeader>
            <h4>Edit Post</h4>
          </ModalHeader>
          <ModalBody>
            <TextArea
              placeholder="post body"
              value={this.state.editPost}
              name="editPost"
              onChange={this.handleInputChange}
              type="text"
              rows="10"
            />
          </ModalBody>
          <ModalFooter>
            <CloseBtn onClick={this.clearState} />
            <SubmitBtn
              action={'Submit Changes'}
              onClick={event => this.handleEditSubmit(event, this.state.editId)}
            />
          </ModalFooter>
        </FormModal>
      </div>
    );
  }
}

export default Profile;
