const API_URL = "https://forkify-api.herokuapp.com/api/v2/recipes";
let bookmarkedRecipes =
  JSON.parse(localStorage.getItem("bookmarkedRecipes")) || [];

// Event listener for search form submission
document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const query = document.getElementById("search-input").value;
  if (query) {
    searchRecipes(query);
  }
});

// Open the add recipe modal
document
  .getElementById("openAddRecipeModal")
  .addEventListener("click", function () {
    document.getElementById("addRecipeModal").style.display = "block";
  });

// Function to search for recipes
function searchRecipes(query) {
  fetch(`${API_URL}?search=${query}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayResults(data.data.recipes);
    })
    .catch((error) => console.error("Error fetching recipes:", error));
}

// Function to get recipe details
function getRecipeDetails(recipeId) {
  fetch(`${API_URL}/${recipeId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayRecipeDetails(data.data.recipe);
    })
    .catch((error) => console.error("Error fetching recipe details:", error));
}

// Function to display search results
function displayResults(recipes) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";
  if (recipes.length === 0) {
    resultsContainer.innerHTML = "<p>No recipes found.</p>";
    return;
  }
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe");
    recipeCard.innerHTML = `
        <img src="${recipe.image_url}" alt="${recipe.title}" />
        <h2>${recipe.title}</h2>
        <h3>Recipe ID: ${recipe.id}</h3>
        <button onclick="getRecipeDetails('${recipe.id}')">View Details</button>
        <button onclick="bookmarkRecipe('${recipe.title}', '${recipe.image_url}', '${recipe.id}')">Bookmark</button>
      `;
    resultsContainer.appendChild(recipeCard);
  });
}

// Function to display recipe details in a modal
function displayRecipeDetails(recipe) {
  const recipeDetails = document.getElementById("recipe-details");
  recipeDetails.innerHTML = `
      <h2>${recipe.title}</h2>
      <img src="${recipe.image_url}" alt="${recipe.title}" />
      <h3>Ingredients</h3>
      <ul>
        ${recipe.ingredients
          .map(
            (ingredient) =>
              `<li>${ingredient.quantity} ${ingredient.unit} ${ingredient.description}</li>`
          )
          .join("")}
      </ul>
  `;
  document.getElementById("recipeModal").style.display = "block";
}

// Function to bookmark a recipe
function bookmarkRecipe(title, image_url, id) {
  const recipe = { title, image_url, id };
  bookmarkedRecipes.push(recipe);
  localStorage.setItem("bookmarkedRecipes", JSON.stringify(bookmarkedRecipes));
  displayBookmarkedRecipes();
}

// Function to display bookmarked recipes
function displayBookmarkedRecipes() {
  const bookmarkedContainer = document.getElementById("bookmarked-recipes");
  bookmarkedContainer.innerHTML = "";
  if (bookmarkedRecipes.length === 0) {
    bookmarkedContainer.innerHTML = "<p>No bookmarked recipes.</p>";
    return;
  }
  bookmarkedRecipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe");
    recipeCard.innerHTML = `
        <img src="${recipe.image_url}" alt="${recipe.title}" />
        <h2>${recipe.title}</h2>
        <h3>Recipe ID: ${recipe.id}</h3>
        <button onclick="getRecipeDetails('${recipe.id}')">View Details</button>
        <button onclick="removeBookmark('${recipe.id}')">Remove Bookmark</button>
      `;
    bookmarkedContainer.appendChild(recipeCard);
  });
}

// Function to remove a bookmarked recipe
function removeBookmark(id) {
  bookmarkedRecipes = bookmarkedRecipes.filter((recipe) => recipe.id !== id);
  localStorage.setItem("bookmarkedRecipes", JSON.stringify(bookmarkedRecipes));
  displayBookmarkedRecipes();
}

// Close modals
document.querySelectorAll(".close").forEach((closeBtn) => {
  closeBtn.addEventListener("click", () => {
    closeBtn.parentElement.parentElement.style.display = "none";
  });
});

// Add a new recipe
document
  .getElementById("add-recipe-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("recipe-title").value;
    const imageUrl = document.getElementById("recipe-image").value;
    const description = document.getElementById("recipe-description").value;

    if (title && imageUrl && description) {
      const userRecipe = {
        title,
        image_url: imageUrl,
        id: `user_${Date.now()}`,
        ingredients: [{ quantity: "", unit: "", description }],
      };
      bookmarkedRecipes.push(userRecipe);
      localStorage.setItem(
        "bookmarkedRecipes",
        JSON.stringify(bookmarkedRecipes)
      );
      displayBookmarkedRecipes();
      document.getElementById("addRecipeModal").style.display = "none";
    }
  });

// Display bookmarked recipes on page load
displayBookmarkedRecipes();
