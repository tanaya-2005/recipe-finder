const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipesContainer = document.querySelector(".recipes");
const noResults = document.querySelector(".no-results");

const modal = document.getElementById("recipeModal");
const modalTitle = document.getElementById("modalTitle");
const modalImg = document.getElementById("modalImg");
const modalInstructions = document.getElementById("modalInstructions");
const modalClose = document.getElementById("modalClose");

async function fetchRecipes(query) {
  recipesContainer.innerHTML = "";
  noResults.style.display = "none";

  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    alert("Please enter a search term!");
    return;
  }

  try {
    const apiURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${cleanQuery}`;
    const encodedAPI = encodeURIComponent(apiURL);
    const proxyURL = `https://api.allorigins.win/raw?url=${encodedAPI}`;
    const res = await fetch(proxyURL);
    const data = await res.json();

    if (!data.meals) {
      noResults.style.display = "block";
      return;
    }

    data.meals.forEach(meal => {
      const card = document.createElement("div");
      card.classList.add("recipe-card");

      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="recipe-content">
          <div class="recipe-title">${meal.strMeal}</div>
          <div class="recipe-instructions">${meal.strInstructions.slice(0, 150)}...</div>
        </div>
      `;

      card.addEventListener("click", () => {
        modalTitle.textContent = meal.strMeal;
        modalImg.src = meal.strMealThumb;
        modalImg.alt = meal.strMeal;
        modalInstructions.textContent = meal.strInstructions;
        modal.style.display = "flex";
      });

      recipesContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Oops! Something went wrong fetching recipes.");
  }
}

searchBtn.addEventListener("click", () => {
  fetchRecipes(searchInput.value);
});

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    fetchRecipes(searchInput.value);
  }
});

modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
