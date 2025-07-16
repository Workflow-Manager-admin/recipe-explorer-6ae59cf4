import React, { useState, useEffect } from "react";
import "./App.css";
import RecipeCard from "./components/RecipeCard";
import "./components/RecipeCard.css";

// PUBLIC_INTERFACE
function Sidebar({ recipes, selectedId, onSelect, onAdd, onSearch, search }) {
  /** Sidebar for navigation and search/filter. */
  return (
    <aside className="sidebar" data-testid="sidebar">
      <div className="sidebar-header">
        <h1>Recipe Explorer</h1>
        <button className="btn primary large" onClick={onAdd}>
          + Add Recipe
        </button>
      </div>
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search by name, ingredient, tag..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          data-testid="search-input"
        />
      </div>
      <nav>
        <ul className="recipe-list">
          {recipes.length === 0 ? (
            <li className="no-recipes">No recipes found.</li>
          ) : (
            recipes.map((r) => (
              <li
                key={r.id}
                className={selectedId === r.id ? "selected" : ""}
                onClick={() => onSelect(r.id)}
                tabIndex={0}
                data-testid={`recipe-${r.id}`}
              >
                <span>{r.name}</span>
              </li>
            ))
          )}
        </ul>
      </nav>
    </aside>
  );
}

/**
 * Main area for viewing recipe details or showing the recipe cards grid.
 * @param {object} props
 * @param {object} props.recipe - The selected recipe, or null if none selected.
 * @param {function} props.onEdit - Callback for editing a recipe.
 * @param {function} props.onDelete - Callback for deleting a recipe.
 * @param {array} [props.recipeCardsList] - Optional list of recipes for the grid.
 */
function RecipeDetails({ recipe, onEdit, onDelete, recipeCardsList }) {
  if (!recipe) {
    // Show a beautiful, responsive grid of RecipeCards for all recipes.
    return (
      <main className="main-content" data-testid="main-content-empty">
        <h2>Browse Recipes</h2>
        <div
          className="recipe-cards-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(255px, 1fr))",
            gap: "2rem",
            width: "100%",
            marginTop: "2rem"
          }}
        >
          {recipeCardsList && recipeCardsList.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                color: "var(--text-secondary)",
                textAlign: "center",
                fontSize: "1.12rem"
              }}
            >
              No recipes found.
            </div>
          ) : (
            recipeCardsList &&
            recipeCardsList.map((r, ix) => (
              <RecipeCard
                key={r.id}
                name={r.name}
                description={
                  r.ingredients && r.ingredients.length
                    ? `Ingredients: ${r.ingredients.slice(0, 3).join(", ")}${
                        r.ingredients.length > 3 ? "..." : ""
                      }`
                    : ""
                }
                tags={r.tags || []}
                // Use a different mock/placeholder image for each entry for demo
                image={`https://source.unsplash.com/featured/320x240?sig=${r.id}&food,recipe`}
              />
            ))
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="main-content" data-testid="main-content">
      <div className="main-header">
        <h2>{recipe.name}</h2>
        <div className="details-actions">
          <button className="btn accent" onClick={onEdit}>
            Edit
          </button>
          <button className="btn danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
      <section>
        <h3>Ingredients</h3>
        <ul className="ingredient-list">
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Instructions</h3>
        <ol className="instructions">
          {recipe.instructions.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </section>
      {recipe.tags && recipe.tags.length > 0 && (
        <footer className="tags">
          {recipe.tags.map((tag, idx) => (
            <span className="tag" key={idx}>
              #{tag}
            </span>
          ))}
        </footer>
      )}
    </main>
  );
}

// PUBLIC_INTERFACE
function RecipeModal({ show, onClose, onSave, editingRecipe }) {
  /** Modal for adding or editing a recipe. */
  const isEdit = !!editingRecipe;
  const [form, setForm] = useState({
    name: editingRecipe ? editingRecipe.name : "",
    ingredients: editingRecipe ? editingRecipe.ingredients.join("\n") : "",
    instructions: editingRecipe
      ? editingRecipe.instructions.join("\n")
      : "",
    tags: editingRecipe ? editingRecipe.tags.join(", ") : ""
  });

  useEffect(() => {
    if (editingRecipe) {
      setForm({
        name: editingRecipe.name,
        ingredients: editingRecipe.ingredients.join("\n"),
        instructions: editingRecipe.instructions.join("\n"),
        tags: editingRecipe.tags.join(", ")
      });
    } else {
      setForm({
        name: "",
        ingredients: "",
        instructions: "",
        tags: ""
      });
    }
  }, [show, editingRecipe]);

  function handleChange(e) {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      name: form.name.trim(),
      ingredients: form.ingredients
        .split("\n")
        .map((i) => i.trim())
        .filter(Boolean),
      instructions: form.instructions
        .split("\n")
        .map((i) => i.trim())
        .filter(Boolean),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    });
    onClose();
  }

  if (!show) return null;

  return (
    <div className="modal-bg" onClick={onClose} data-testid="modal-bg">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>{isEdit ? "Edit Recipe" : "Add Recipe"}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Name<span className="required">*</span>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              />
          </label>
          <label>
            Ingredients<span className="required">*</span>
            <textarea
              name="ingredients"
              required
              rows={5}
              placeholder="One per line"
              value={form.ingredients}
              onChange={handleChange}
            />
          </label>
          <label>
            Instructions<span className="required">*</span>
            <textarea
              name="instructions"
              required
              rows={5}
              placeholder="One step per line"
              value={form.instructions}
              onChange={handleChange}
            />
          </label>
          <label>
            Tags
            <input
              type="text"
              name="tags"
              placeholder="e.g. dessert, quick"
              value={form.tags}
              onChange={handleChange}
            />
          </label>
          <div className="modal-actions">
            <button className="btn primary" type="submit">
              {isEdit ? "Save" : "Add"}
            </button>
            <button
              type="button"
              className="btn"
              onClick={onClose}
              style={{ marginLeft: "0.5rem" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Core app component with full recipe CRUD and layout
// PUBLIC_INTERFACE
function App() {
  // Local "database" (replace with API integration if backend is available)
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: "Spaghetti Carbonara",
      ingredients: [
        "200g spaghetti",
        "2 eggs",
        "100g pancetta",
        "50g parmesan",
        "Salt and pepper"
      ],
      instructions: [
        "Boil spaghetti.",
        "Fry pancetta.",
        "Beat eggs with cheese.",
        "Drain pasta, mix quickly with eggs, pancetta.",
        "Serve immediately."
      ],
      tags: ["italian", "pasta", "quick"]
    },
    {
      id: 2,
      name: "Chocolate Mug Cake",
      ingredients: [
        "4 tbsp flour",
        "4 tbsp sugar",
        "2 tbsp cocoa powder",
        "1 egg",
        "3 tbsp milk",
        "3 tbsp oil",
        "Pinch of salt"
      ],
      instructions: [
        "Mix dry ingredients in mug.",
        "Add egg, milk, oil; stir well.",
        "Microwave for 90 seconds.",
        "Let cool and enjoy."
      ],
      tags: ["dessert", "quick", "microwave"]
    }
  ]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [theme, setTheme] = useState("light");

  // Sync theme with document for easy theme toggling.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Filter and search recipes
  const filteredRecipes = recipes.filter((recipe) => {
    const s = search.toLowerCase();
    return (
      recipe.name.toLowerCase().includes(s) ||
      recipe.ingredients.join(" ").toLowerCase().includes(s) ||
      (recipe.tags && recipe.tags.join(" ").toLowerCase().includes(s))
    );
  });

  // Find currently selected recipe for detail view.
  const selectedRecipe = recipes.find((r) => r.id === selectedId);

  function handleAdd() {
    setEditingRecipe(null);
    setModalOpen(true);
  }
  function handleEdit() {
    setEditingRecipe(selectedRecipe);
    setModalOpen(true);
  }
  function handleDelete() {
    if (
      window.confirm(
        `Are you sure you want to delete recipe "${selectedRecipe?.name}"?`
      )
    ) {
      setRecipes((r) => r.filter((rec) => rec.id !== selectedId));
      setSelectedId(null);
    }
  }
  function handleSave(newRecipe) {
    if (editingRecipe) {
      // Edit mode
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === editingRecipe.id
            ? { ...r, ...newRecipe }
            : r
        )
      );
      setSelectedId(editingRecipe.id);
    } else {
      // Add mode
      const lastId = recipes.length
        ? Math.max(...recipes.map((r) => r.id))
        : 0;
      setRecipes((prev) => [
        ...prev,
        { ...newRecipe, id: lastId + 1 }
      ]);
      setSelectedId(lastId + 1);
    }
  }
  function handleThemeToggle() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }
  // Dismiss modal
  function closeModal() {
    setModalOpen(false);
    setEditingRecipe(null);
  }

  return (
    <div className="App recipe-explorer-app">
      <button
        className="theme-toggle"
        onClick={handleThemeToggle}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <div className="app-container">
        <Sidebar
          recipes={filteredRecipes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={handleAdd}
          onSearch={setSearch}
          search={search}
        />
        <RecipeDetails
          recipe={selectedRecipe}
          onEdit={handleEdit}
          onDelete={handleDelete}
          recipeCardsList={filteredRecipes}
        />
        <RecipeModal
          show={modalOpen}
          onClose={closeModal}
          onSave={handleSave}
          editingRecipe={editingRecipe}
        />
      </div>
    </div>
  );
}

export default App;
