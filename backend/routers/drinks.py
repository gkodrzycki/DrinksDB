from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from backend.models import Drink, SearchFilters
from backend.data_handler import DrinksDataHandler

router = APIRouter(prefix="/api/drinks", tags=["drinks"])
data_handler = DrinksDataHandler()


@router.get("/", response_model=List[Drink])
async def get_all_drinks():
    return data_handler.get_all_drinks()


@router.get("/random", response_model=Drink)
async def get_random_drink(
    include_ingredients: Optional[str] = Query(None, description="Comma-separated ingredients to include"),
    exclude_ingredients: Optional[str] = Query(None, description="Comma-separated ingredients to exclude"),
    alcohol_types: Optional[str] = Query(None, description="Comma-separated alcohol types"),
    flavors: Optional[str] = Query(None, description="Comma-separated flavor tags"),
    category: Optional[str] = Query(None, description="Drink category")
):
    filters = SearchFilters(
        include_ingredients=include_ingredients.split(',') if include_ingredients else None,
        exclude_ingredients=exclude_ingredients.split(',') if exclude_ingredients else None,
        alcohol_types=alcohol_types.split(',') if alcohol_types else None,
        flavors=flavors.split(',') if flavors else None,
        category=category
    )

    drink = data_handler.get_random_drink(filters if any([
        filters.include_ingredients,
        filters.exclude_ingredients,
        filters.alcohol_types,
        filters.flavors,
        filters.category
    ]) else None)

    if not drink:
        raise HTTPException(status_code=404, detail="No drinks found matching the criteria")

    return drink


@router.get("/search", response_model=List[Drink])
async def search_drinks(
    include_ingredients: Optional[str] = Query(None, description="Comma-separated ingredients to include"),
    exclude_ingredients: Optional[str] = Query(None, description="Comma-separated ingredients to exclude"),
    alcohol_types: Optional[str] = Query(None, description="Comma-separated alcohol types"),
    flavors: Optional[str] = Query(None, description="Comma-separated flavor tags"),
    category: Optional[str] = Query(None, description="Drink category")
):
    filters = SearchFilters(
        include_ingredients=include_ingredients.split(',') if include_ingredients else None,
        exclude_ingredients=exclude_ingredients.split(',') if exclude_ingredients else None,
        alcohol_types=alcohol_types.split(',') if alcohol_types else None,
        flavors=flavors.split(',') if flavors else None,
        category=category
    )

    return data_handler.search_drinks(filters)


@router.get("/{drink_id}", response_model=Drink)
async def get_drink(drink_id: str):
    drink = data_handler.get_drink_by_id(drink_id)
    if not drink:
        raise HTTPException(status_code=404, detail=f"Drink with id '{drink_id}' not found")
    return drink
