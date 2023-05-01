import React, { useState } from "react";
import { Transition } from "@headlessui/react";

function RecipeFinder() {
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const searchRecipes = async (e) => {
    e.preventDefault();
    const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=ccef54d0775e4b43bac36c86ce26b060&ingredients=${query}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setRecipes(data);
      setShowSearchBar(false);
    } catch (error) {
      console.log(error);
    }
  };

  const viewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <div className="bg-gray-200
 min-h-screen">
      <header className="sticky top-0 z-50 bg-purple-700">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-200">Recipe Finder</h1>
          {!showSearchBar && (
            <button
              onClick={() => setShowSearchBar(true)}
              className= "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg inline-block"
            >
              Back
            </button>
          )}
        </div>
      </header>
      <div className="container mx-auto p-4">
        <Transition
          show={showSearchBar}
          enter="transition-opacity ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 text-red-900">
              Search for recipes with what ingredients you have
            </h2>
            <form onSubmit={searchRecipes} className="flex justify-center mt-4">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Enter ingredients"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mr-2"
                />
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </Transition>
        {!recipes && (
  <div className="flex justify-center items-center mt-10">
    <img src={process.env.PUBLIC_URL + '/chef.png'} alt="chef" className="w-64 h-64"/>
  </div>
)}

        {!showSearchBar && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 mt-4">Recipes found</h2>
          </div>
        )}
       {recipes && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {recipes.map((recipe) => (
<div key={recipe.id} onClick={() => viewRecipe(recipe)} className="cursor-pointer">
  <div className="shadow-md hover:shadow-xl rounded-md overflow-hidden">
    <img src={recipe.image} alt={recipe.title} className="w-full h-56 object-cover" />
    <div className="h-32 p-4 flex flex-col justify-between">
      <h2 className="text-xl font-bold mb-2 overflow-hidden overflow-ellipsis">{recipe.title}</h2>
      {/* <p className="text-gray-800">{recipe.summary}</p> */}
    </div>
  </div>
</div>

))}
</div>
}
{selectedRecipe && (
  <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center">
    <div className="absolute bg-white rounded-lg shadow-lg w-3/4 h-5/6 sm:h-auto overflow-auto">
      <div className="flex justify-between items-start border-b-2 border-gray-200 px-4 py-2">
        <h1 className="text-2xl lg:text-4xl font-bold text-green-900">{selectedRecipe.title}</h1>
        <button
          onClick={() => setSelectedRecipe(null)}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg "
        >
          Close
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <div>
          <img
            src={selectedRecipe.image}
            alt={selectedRecipe.title}
            className="w-full h-56 object-cover rounded-md shadow-md hover:shadow-xl"
          />
        </div>
        <div>
          <p className="text-gray-800 text-sm lg:text-base">{selectedRecipe.summary}</p>
          {selectedRecipe.usedIngredients && (
            <>
              <p className="mt-4 font-bold text-sm lg:text-base">Ingredients:</p>
              <ul className="list-disc pl-4">
                {selectedRecipe.usedIngredients.map((ingredient) => (
                  <li key={ingredient.id} className="text-sm lg:text-base">{ingredient.original}</li>
                ))}
              </ul>
            </>
          )}
          {selectedRecipe.missedIngredients && (
            <>
              <p className="mt-4 font-bold text-red-500 text-sm lg:text-base">Missing Ingredients:</p>
              <ul className="list-disc pl-4">
                {selectedRecipe.missedIngredients.map((ingredient) => (
                  <li key={ingredient.id} className="text-sm lg:text-base">{ingredient.original}</li>
                ))}
              </ul>
            </>
          )}
          <button
            onClick={async () => {
              const url = `https://api.spoonacular.com/recipes/${selectedRecipe.id}/information?apiKey=ccef54d0775e4b43bac36c86ce26b060&includeNutrition=false`;
              try {
                const res = await fetch(url);
                const selectedRecipeDetails = await res.json();

                if (selectedRecipeDetails.spoonacularSourceUrl) {
                  window.open(selectedRecipeDetails.spoonacularSourceUrl);
                }
              } catch (error) {
                console.log(error);
              }
            }}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg mt-4 text-sm lg:text-base"
          >
            View Recipe
          </button>
        </div>
      </div>
    </div>
  </div>
)}

</div>
<footer className="text-center py-4 bg-gray-900 text-white text-sm fixed bottom-0 w-full">
    A simple website to fetch recipes using Spoonacular API.
    Made with <span className="text-red-500">&hearts;</span> and <span className="text-blue-500">React</span>.
</footer>
</div>
);
}

export default RecipeFinder;