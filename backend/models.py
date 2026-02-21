from sqlmodel import Field, SQLModel, Relationship, Column, JSON
from typing import List, Optional
from sqlalchemy import JSON as SAJSON


class DrinkIngredientLink(SQLModel, table=True):
    drink_id: str = Field(default=None, foreign_key="drink.id", primary_key=True)
    ingredient_id: str = Field(
        default=None, foreign_key="ingredient.id", primary_key=True
    )
    measure: str = Field(default="")


class Ingredient(SQLModel, table=True):
    id: str = Field(primary_key=True, description="Lower cased, dash separated id")
    name: str = Field(index=True)
    type: Optional[str] = Field(
        default=None, description="e.g. alcohol, mixer, syrup, garnish"
    )


class Drink(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: str = Field(index=True)
    image: Optional[str] = Field(default=None)
    category: str
    alcohol_type: List[str] = Field(default_factory=list, sa_column=Column(SAJSON))
    instructions: List[str] = Field(default_factory=list, sa_column=Column(SAJSON))
    glass_type: Optional[str] = Field(default=None)
    flavors: List[str] = Field(default_factory=list, sa_column=Column(SAJSON))
    garnish: Optional[str] = Field(default=None)


class DrinkCreate(SQLModel):
    id: str
    name: str
    image: Optional[str] = None
    category: str
    alcohol_type: List[str] = []
    instructions: List[str] = []
    glass_type: Optional[str] = None
    flavors: List[str] = []
    garnish: Optional[str] = None
    ingredients: List[str] = []


class DrinkRead(DrinkCreate):
    pass


class SearchFilters(SQLModel):
    include_ingredients: Optional[List[str]] = None
    exclude_ingredients: Optional[List[str]] = None
    alcohol_types: Optional[List[str]] = None
    flavors: Optional[List[str]] = None
    category: Optional[str] = None
