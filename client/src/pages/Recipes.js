import React, { Component } from "react";
import RecipeCard from "../components/RecipeCard";
import API from "../utils/API";
import SearchBar from "../components/SearchBar";
import GridContainer from "../components/GridContainer";
import { Container } from "../components/Grid";

class Recipes extends Component {
  state = {
    id: null,
    results: [],
    query: "",
    favorites: [],
    favoriteIDs: [],
    /*Recipes go here until they are posted This is in case someone clicks the favorite button 
    again before the post goes through. */
    stagedRecipes: [],
  };

  // Upon initial render, populate recipe cards with default search "vegan"
  componentDidMount = () => {
    this.searchRecipes("vegan");
    this.loadUserRecipes();
    this.searchRecipes("vegan");
  };

  deleteRecipeByTitle = (title) => {
    //Get index of title, then use that index to grab ID.
    console.log("Deleting item by title...");
    let index = this.state.favorites.indexOf(title);
    console.log(`Index of item is: ${index}`);
    let mealId = this.state.favoriteIDs[index];
    //Use that ID to delete.
    API.deleteMeal(mealId).then((res, err) => {
      if (err) {
        console.log(err);
      }
      //When recipes are deleted, reload user favorites to handle color change of heart icon.
      this.loadUserRecipes();
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

  // Handles changes in input of form
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  // When recipe card favorite button clicked, create object and insert into MongoDB.
  handleFavoriteClick = (id) => {
    //Grab card elements to prepare to post to MongoDB.
    let savedRecipe = {
      title: document.getElementById("card-title-" + id).textContent,
      image: document.getElementById("card-image-" + id).getAttribute("src"),
      link: document.getElementById("card-link-" + id).getAttribute("href"),
      calories: document
        .getElementById("card-calories-" + id)
        .textContent.split(" ")[0],
    };
    console.log(savedRecipe);
    //If card is in staging area already when button is clicked, remove from staging area to prevent multiple-posting.
    if (this.state.stagedRecipes.includes(savedRecipe.title)) {
      this.setState({
        stagedRecipes: this.state.stagedRecipes.filter(
          (recipe) => recipe !== savedRecipe.title
        ),
        favorites: this.state.favorites.filter(
          (recipe) => recipe !== savedRecipe.title
        ),
      });
    }
    //If card not currently in favorites, save recipe.
    else if (!this.state.favorites.includes(savedRecipe.title)) {
      this.saveRecipe(savedRecipe);
      this.setState({
        stagedRecipes: this.state.stagedRecipes.concat([savedRecipe.title]),
        favorites: this.state.favorites.concat([savedRecipe.title]),
      });
    } else {
      //If recipe already in favorites, delete recipe.
      this.deleteRecipeByTitle(savedRecipe.title);
      this.setState({
        favorites: this.state.favorites.filter(
          (meal) => meal !== savedRecipe.title
        ),
      });
    }
  };

  // When search form submitted, search for recipes
  handleFormSubmit = (event) => {
    event.preventDefault();
    if (this.state.query) {
      this.searchRecipes(this.state.query);
    }
  };

  loadUserRecipes = () => {
    //Grabs user meals
    API.getMealsByUser(this.props.id).then((res, err) => {
      if (err) {
        console.log(err);
      }
      //Arrays to save titles of user meals and corresponding IDs
      let userFavorites = [];
      let savedMealIds = [];
      //For each meal, push the title and the id into the corresponding array.
      //The indexes of the titles and ids will match.
      res.data.meal.forEach((meal) => {
        userFavorites.push(meal.title);
        savedMealIds.push(meal._id);
      });
      //Set the state to hold the titles and ids.
      this.setState({ favorites: userFavorites, favoriteIDs: savedMealIds });
    });
  };

  // Post recipes to MongoDB
  saveRecipe = (recipe) => {
    API.postMeal(this.props.id, recipe).then((res, err) => {
      if (err) {
        console.log(err);
      }
      console.log(res);
      console.log(res.data._id);
      if (this.state.stagedRecipes.includes(recipe.title)) {
        this.setState({
          stagedRecipes: this.state.stagedRecipes.filter(
            (meal) => meal !== recipe.title
          ),
        });
        this.loadUserRecipes();
      } else {
        this.deleteUserRecipe(res.data._id);
      }
    });
  };

  // Search for recipes using Edamam API
  searchRecipes = (query) => {
    API.getMeals(query).then((results) => {
      console.log(results);
      this.setState({
        results: results.data.hits,
      });
    });
  };

  render() {
    return (
      <Container>
        <div className="recipes">
          <SearchBar
            handleInputChange={this.handleInputChange}
            handleFormSubmit={this.handleFormSubmit}
            value={this.state.query}
          />
          <GridContainer style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            {/* Generate recipe cards for each result */}
            {this.state.results.map((recipe, index) => (
              <RecipeCard
                key={index}
                id={index}
                image={recipe.recipe.image}
                name={recipe.recipe.label}
                link={recipe.recipe.url}
                favorite={this.handleFavoriteClick}
                calories={recipe.recipe.calories}
                //If meal is in favorites, this is used to change heart icon color in recipe card.
                savedMeal={
                  this.state.favorites.includes(recipe.recipe.label)
                    ? true
                    : false
                }
              />
            ))}
          </GridContainer>
        </div>
      </Container>
    );
  }
}

export default Recipes;
