import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import GridContainer from '../GridContainer';

function PostCard(props) {
  return (
    <div className="card-body">
      <div className="row">
        <div className="col-2 sm-3">
          <Link to={'/users/' + props.username}>
            <div id="postImgDiv">
              <img id="postImg" src={props.image} alt="profile-pic" />
            </div>
          </Link>
        </div>
        <div className="col-10 sm-9">
          <GridContainer style={{ gridTemplateColumns: '1fr 200px' }}>
            <h5 className="card-title mb-2">
              {props.firstName} {props.lastName}
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {props.createdAt ? (
                <Moment format="MM/DD/YYYY hh:mm a" date={props.createdAt} />
              ) : null}
            </h6>
          </GridContainer>

          <div className="card-text mb-1">{props.postBody}</div>
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
