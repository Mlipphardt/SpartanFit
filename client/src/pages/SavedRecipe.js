import React, { Component } from "react";
import RecipeCard from "../components/RecipeCard";
import API from "../utils/API";
import Wrapper from "../components/Wrapper";
import GridContainer from "../components/GridContainer";
import { Col, Row, Container } from "../components/Grid";

class Recipes extends Component {
  state = {
    id: null,
    results: [],
    saved: [],
  };

  // Upon initial render, populate recipe cards from user's favorites
  componentDidMount = () => {
    this.loadUserRecipes();
  };

  //Grab user recipes
  loadUserRecipes = () => {
    API.getMealsByUser(this.props.id).then((res, err) => {
      if (err) {
        console.log(err);
      }
      this.setState({ results: res.data.meal });
    });
  };

  deleteUserRecipe = (id) => {
    API.deleteMeal(id).then((err, res) => {
      if (err) {
        console.log(err);
      }
      this.loadUserRecipes();
    });
  };

  render() {
    return (
      <Container>
        <div className="recipes">
          <h1>
            <strong>Your Favorites</strong>
          </h1>
          <GridContainer style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            {/* Generate recipe cards for each result */}
            {this.state.results.map((recipe, index) => (
              <RecipeCard
                key={recipe._id}
                id={recipe._id}
                image={recipe.image}
                name={recipe.title}
                link={recipe.link}
                calories={recipe.calories ? recipe.calories : 300}
                delete={this.deleteUserRecipe}
              />
            ))}
          </GridContainer>
        </div>
      </Container>
    );
  }
}

export default Recipes;
