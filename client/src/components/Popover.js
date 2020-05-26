import React, { useState, useRef } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Moment from 'react-moment';

function Notifications(props) {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = event => {
    setShow(!show);
    setTarget(event.target);
  };

  return (
    <div ref={ref}>
      <i className="fas fa-bell" onClick={handleClick}></i>

      <Overlay
        show={show}
        target={target}
        placement="bottom"
        container={ref.current}
        containerPadding={20}
      >
        <Popover id="popover-contained">
          <Popover.Title id="popover-header" as="h3">
            Notifications
          </Popover.Title>
          <Popover.Content>
            {props.notifications.length ? (
              <div>
                {props.notifications.map(n => {
                  if (n.postId) {
                    return (
                      <div className="mb-1">
                        <strong>
                          <a id="user-name" href={'/users/' + n.username}>
                            {n.firstName} {n.lastName}
                          </a>
                        </strong>{' '}
                        {n.notificationType} on your{' '}
                        <a id="post-notification" href={'/posts/' + n.postId}>
                          post
                        </a>
                        <i
                          class="fas fa-times-circle"
                          id="x-icon"
                          onClick={() => props.deleteNotification(n._id)}
                        ></i>{' '}
                        <Moment fromNow>{n.createdAt}</Moment>
                      </div>
                    );
                  } else {
                    return (
                      <div className="mb-1">
                        <strong>
                          <a id="user-name" href={'/users/' + n.username}>
                            {n.firstName} {n.lastName}
                          </a>
                        </strong>{' '}
                        {n.notificationType}
                        <i
                          class="fas fa-times-circle"
                          id="x-icon"
                          onClick={() => props.deleteNotification(n._id)}
                        ></i>{' '}
                        <Moment fromNow>{n.createdAt}</Moment>
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <p>No notifications</p>
            )}
          </Popover.Content>
        </Popover>
      </Overlay>
    </div>
  );
}

export default Notifications;
