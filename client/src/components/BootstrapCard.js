import React from 'react';

export function CardDiv(props) {
  return <div className="card">{props.children}</div>;
}

export function CardImage(props) {
  return (
    <img
      className="card-img-top"
      src={props.image}
      alt="Card image cap"
      style={{ maxHeight: 300, objectFit: 'cover' }}
    ></img>
  );
}

export function CardBody(props) {
  return (
    <div className="card-body" id={props.id}>
      {props.children}
    </div>
  );
}

export function CardSubtitle(props) {
  return <h6 className="card-subtitle mb-2 text-muted">{props.children}</h6>;
}

export function CardTitle(props) {
  return <h5 className="card-title">{props.children}</h5>;
}

export function CardText(props) {
  return <p className="card-text">{props.children}</p>;
}

export function CardHeader(props) {
  return <div className="card-header">{props.children}</div>;
}
