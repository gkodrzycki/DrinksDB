from pydantic import BaseModel, Field
from typing import List, Optional


class Drink(BaseModel):
    """Model for a cocktail drink recipe"""
    id: str = Field(..., description="Unique identifier for the drink")
    name: str = Field(..., description="Name of the drink")
    image: Optional[str] = Field(None, description="Path to drink image")
    category: str = Field(..., description="Category (e.g., Cocktail, Shot, Mocktail)")
    alcohol_type: List[str] = Field(default_factory=list, description="Types of alcohol used")
    ingredients: List[str] = Field(..., description="List of ingredients with measurements")
    instructions: List[str] = Field(..., description="Step-by-step preparation instructions")
    glass_type: Optional[str] = Field(None, description="Recommended glass type")
    flavors: List[str] = Field(default_factory=list, description="Flavor profile tags")
    garnish: Optional[str] = Field(None, description="Garnish description")


class SearchFilters(BaseModel):
    """Model for drink search filters"""
    include_ingredients: Optional[List[str]] = Field(None, description="Ingredients that must be present")
    exclude_ingredients: Optional[List[str]] = Field(None, description="Ingredients that must not be present")
    alcohol_types: Optional[List[str]] = Field(None, description="Filter by alcohol types")
    flavors: Optional[List[str]] = Field(None, description="Filter by flavor tags")
    category: Optional[str] = Field(None, description="Filter by category")
