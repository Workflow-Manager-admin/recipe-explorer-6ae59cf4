import React from "react";
import "./RecipeCard.css";

// PUBLIC_INTERFACE
function RecipeCard({ name, description, tags, image }) {
  /**
   * Renders a single recipe card with image, title, description, and tags.
   * @param {string} name - Recipe name
   * @param {string} description - Short description or summary (ingredients/tags)
   * @param {array} tags - Array of tag strings
   * @param {string} image - Image URL or mock image path
   */
  return (
    <div className="recipe-card">
      <div className="recipe-card-image-container">
        <img
          className="recipe-card-image"
          src={image}
          alt={name}
          loading="lazy"
        />
      </div>
      <div className="recipe-card-content">
        <h3 className="recipe-card-title">{name}</h3>
        {description && (
          <p className="recipe-card-description">{description}</p>
        )}
        {tags && tags.length > 0 && (
          <div className="recipe-card-tags">
            {tags.map((tag, i) => (
              <span className="recipe-card-tag" key={i}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeCard;
