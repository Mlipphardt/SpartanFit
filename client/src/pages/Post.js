import React, { Component } from 'react';
import API from '../utils/API';
import PostCard from '../components/PostCard';
import { CardDiv, CardBody } from '../components/BootstrapCard';
import { Row } from '../components/Grid';
import { TextArea } from '../components/Form';
import { InputBar, BarInput, InputBarBtn } from '../components/InputBar';
import thumb from '../images/thumb.png';
import {
  FormModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  SubmitBtn,
  CloseBtn,
} from '../components/BootstrapModal';
import Dropdown from '../components/Dropdown';

class Post extends Component {
  constructor(props) {
    super(props);
    this.route = window.location.pathname;
    this.state = {
      id: '',
      postId: '',
      posterId: '',
      username: '',
      firstName: '',
      lastName: '',
      comments: '',
      postBody: '',
      userpic: '',
      commentBody: '',
      comments: [],
      commenterData: null,
      commenterImageUrl: '',
      editId: '',
      editComment: '',
    };
  }

  componentDidMount = () => {
    //this.props.getUser(); //i don't think this was needed but leaving the reference in case
    this.setState({ id: this.props.id });
    this.loadPost();
    this.loadCommenterData();
  };

  loadPost = () => {
    API.getPost(this.route).then((res, err) => {
      if (err) {
        console.log(err);
      }
      this.setState({
        postId: res.data._id,
        posterId: res.data.userId,
        username: res.data.username,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        postBody: res.data.postBody,
        comments: res.data.comments,
        userpic: res.data.userpic,
      });
    });
  };

  loadCommenterData = () => {
    API.getUser(this.props.id).then((res, err) => {
      if (err) {
        console.log(err);
      }
      this.setState({
        commenterData: res.data,
        commenterImageUrl: res.data.image[0]
          ? res.data.image[0].profileImg
          : thumb,
      });
    });
  };

  handleInputChange = event => {
    let value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value,
    });
  };

  handleCommentClick = event => {
    event.preventDefault();
    API.makeComment(this.state.postId, {
      commenterId: this.state.commenterData._id,
      username: this.state.commenterData.slug,
      commentBody: this.state.commentBody,
      firstName: this.state.commenterData.firstName,
      lastName: this.state.commenterData.lastName,
      userpic: this.state.commenterImageUrl,
      userId: this.state.id,
      originalPoster: this.state.posterId,
      postId: this.state.postId,
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            commentBody: '',
          });
          this.loadPost();
        }
      })
      .catch(err => console.log(err));
  };

  handleEditBtn = (event, id, comment) => {
    event.preventDefault();
    this.setState({
      editId: id,
      editComment: comment,
    });
  };

  handleEditSubmit = (event, id) => {
    event.preventDefault();
    if (this.state.editComment) {
      API.editComment(id, {
        commentBody: this.state.editComment,
      })
        .then(res => this.loadPost())
        .catch(err => console.log(err));
      const show = true;
      const message = 'Post updated successfully';
      const variant = 'success';
      this.setState({ show: show, message: message, variant: variant });
    }
  };

  deletePost = id => {
    API.deleteComment(id)
      .then(res => this.loadPost())
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
      //profile-page css is also good for this
      <div className="profile-page">
        <h4>
          {this.state.firstName} {this.state.lastName}'s Post
        </h4>
        <hr></hr>

        <CardDiv>
          <CardBody>
            <Row>
              <PostCard
                key={this.state.postId}
                id={this.state.postId}
                firstName={this.state.firstName}
                lastName={this.state.lastName}
                image={this.state.userpic}
                username={this.state.username}
                postBody={this.state.postBody}
              >
                <Row>
                  <div>
                    <i class="far fa-comments"></i> (
                    {this.state.comments.length})
                  </div>
                </Row>
              </PostCard>
            </Row>
            <h4>Comments</h4>
            <hr></hr>
            <InputBar barName={'postbar'}>
              <BarInput
                onChange={this.handleInputChange}
                name="commentBody"
                value={this.state.commentBody}
                type="text"
              />
              <InputBarBtn onClick={this.handleCommentClick} label="Comment" />
            </InputBar>
            {this.state.comments.length ? (
              <div>
                {this.state.comments.map(comment => (
                  <CardDiv>
                    <PostCard
                      key={comment._id}
                      id={comment._id}
                      firstName={comment.firstName}
                      lastName={comment.lastName}
                      image={comment.userpic}
                      username={comment.username}
                      postBody={comment.commentBody}
                      createdAt={comment.createdAt}
                    >
                      {this.state.id === comment.userId ? (
                        <Dropdown>
                          <div
                            className="dropdown-item"
                            data-toggle="modal"
                            data-target="#editModal"
                            onClick={event =>
                              this.handleEditBtn(
                                event,
                                comment._id,
                                comment.commentBody
                              )
                            }
                          >
                            Edit
                          </div>
                          <div
                            className="dropdown-item"
                            onClick={() => this.deletePost(comment._id)}
                          >
                            {' '}
                            Delete
                          </div>
                        </Dropdown>
                      ) : (
                        <Dropdown>
                          <div>
                            Can't edit or delete other people's comments
                          </div>
                        </Dropdown>
                      )}
                    </PostCard>
                  </CardDiv>
                ))}
              </div>
            ) : (
              <h3>No Comments to Display</h3>
            )}
          </CardBody>
        </CardDiv>
        <FormModal id={'editModal'} clearState={this.clearState}>
          <ModalHeader>
            <h4>Edit Comment</h4>
          </ModalHeader>
          <ModalBody>
            <TextArea
              value={this.state.editComment}
              name="editComment"
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

export default Post;
