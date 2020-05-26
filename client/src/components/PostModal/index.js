import React, { Component } from 'react';
import './style.css';
import API from '../../utils/API';
import {
  CardDiv,
  CardBody,
  CardTitle,
  CardSubtitle,
} from '../../components/BootstrapCard';
import { FormModal } from '../../components/BootstrapModal';
import GridContainer from '../../components/GridContainer';
import { Link } from 'react-router-dom';

class PostModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posterId: '',
      posterFirstName: '',
      posterLastName: '',
      posterSlug: '',
      postBody: '',
      postWallId: '',
      posterCity: '',
      posterState: '',
    };
  }

  componentWillMount = () => {
    //this.props.getUser(); //i don't think this was needed but leaving the reference in case
    this.setState({
      posterId: this.props.id,
    });
    this.loadUserProfile();
  };

  loadUserProfile = () => {
    API.getUser(this.props.id).then((res, err) => {
      if (err) {
        console.log(err);
      }
      this.setState({
        postWallId: this.props.postWallId,
        posterFirstName: res.data.firstName,
        posterLastName: res.data.lastName,
        posterSlug: res.data.slug,
        posterCity: res.data.city,
        posterState: res.data.state,
        imageUrl: res.data.image[0]
          ? res.data.image[0].profileImg
          : 'https://spartanfit.s3.us-east-2.amazonaws.com/1590371866852',
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

  handlePostSubmit = event => {
    event.preventDefault();
    if (this.state.postWallId) {
      API.makePost(this.state.posterId, {
        username: this.state.posterSlug,
        firstName: this.state.posterFirstName,
        lastName: this.state.posterLastName,
        userpic: this.state.imageUrl,
        postBody: this.state.postBody,
        userId: this.state.posterId,
      })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              postBody: '',
            });
            this.props.loadPosts();
          }
        })
        .catch(err => console.log(err));
    }
  };

  clearState = () => {
    this.setState({
      editId: '',
      editPost: '',
    });
  };

  render() {
    return (
      <div>
        <div
          data-toggle="modal"
          data-target="#postModal"
          style={{ cursor: 'pointer' }}
        >
          <i className="fas fa-edit"></i> Write Post
        </div>

        <FormModal id={'postModal'} clearState={this.clearState}>
          <CardDiv>
            <CardBody>
              <GridContainer style={{ gridTemplateColumns: '60px 1fr 100px' }}>
                <Link to={'/users/' + this.state.posterSlug}>
                  <div id="postImgDiv">
                    <img
                      id="postImg"
                      src={this.state.imageUrl}
                      alt="profile-pic"
                    />
                  </div>
                </Link>
                <CardTitle>
                  {this.state.posterFirstName} {this.state.posterLastName}
                  <div className="mt-1">
                    <CardSubtitle>
                      {this.state.posterCity}, {this.state.posterState}
                    </CardSubtitle>
                  </div>
                </CardTitle>
                <div>
                  <button
                    className="btn btn-primary btn-sm"
                    data-dismiss="modal"
                    id="postBtn"
                    onClick={this.handlePostSubmit}
                  >
                    Send Post
                  </button>
                </div>
              </GridContainer>
            </CardBody>
            <div className="form-group" id="postText">
              <textarea
                onChange={this.handleInputChange}
                name="postBody"
                value={this.state.postBody}
                className="form-control"
                rows="10"
                placeholder="Post something on SpartanFit Social..."
              ></textarea>
            </div>
          </CardDiv>
        </FormModal>
      </div>
    );
  }
}

export default PostModal;
