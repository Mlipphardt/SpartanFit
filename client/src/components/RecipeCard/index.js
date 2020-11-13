import React from "react";
import "./style.css";

function RecipeCard(props) {
  return (
    <div className="card promoting-card" id={`card-${props.id}`}>
      <div className="card-body" style={{ height: "3%" }}>
        {/* If card is saved, tell user. */}
        {props.calories ? (
          <span
            className="float-left fadeIn my-1 calorie-count"
            id={`card-calories-${props.id}`}
          >
            {Math.trunc(props.calories)} calories
          </span>
        ) : (
          ""
        )}
        {/* If card is called from Search page, add favorite icon. Else, add delete icon. */}
        {props.favorite ? (
          <i
            className={
              // Icon turns red or gray depending on if the item is saved.
              props.savedMeal
                ? "fas fa-heart saved-meal float-right p-1 my-1"
                : "fas fa-heart text-muted float-right p-1 my-1"
            }
            id={`favorite-icon-${props.id}`}
            data-saved={props.savedMeal ? "true" : "false"}
            data-toggle="tooltip"
            data-placement="top"
            title="Add to my recipes"
            //When icon is clicked, either insert into MongoDB if not favorited, or delete if favorited.
            onClick={() => props.favorite(props.id)}
          ></i>
        ) : (
          <i
            className="fas fa-times float-right p-1 my-1"
            data-toggle="tooltip"
            data-placement="top"
            title="Remove from My Recipes"
            //   When this icon is clicked, delete from MongoDB
            onClick={() => props.delete(props.id)}
          ></i>
        )}
        <i
          className="fas fa-share-alt text-muted float-right p-1 my-1 mr-2"
          data-toggle="tooltip"
          data-placement="top"
          title="Share this post"
        ></i>
      </div>
      <div className="view overlay">
        <a
          href={props.link}
          id={`card-link-${props.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            id={`card-image-${props.id}`}
            className="card-img-top rounded-0"
            src={props.image}
            alt={props.name}
            style={{ maxHeight: 200, objectFit: "cover" }}
          />
          <div className="mask rgba-white-slight"></div>
        </a>
      </div>
      <div className="card-body d-flex flex-row">
        {/* Content */}
        <div>
          {/* Title */}
          <h4
            className="card-title font-weight-bold mb-2"
            id={`card-title-${props.id}`}
          >
            {props.name}
          </h4>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
