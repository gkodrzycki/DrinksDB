import random
import re
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, func, select

from backend.database import get_session
from backend.models import (Drink, DrinkCreate, DrinkIngredientLink, DrinkRead,
                            Ingredient, SearchFilters)

router = APIRouter(prefix="/api/drinks", tags=["drinks"])


def format_drink_read(drink: Drink, session: Session) -> DrinkRead:
    ingredients_str = []
    links = session.exec(
        select(DrinkIngredientLink).where(DrinkIngredientLink.drink_id == drink.id)
    ).all()
    for link in links:
        ing = session.get(Ingredient, link.ingredient_id)
        if ing:
            if link.measure:
                ingredients_str.append(f"{link.measure} {ing.name}")
            else:
                ingredients_str.append(ing.name)

    d_dict = drink.model_dump()
    d_dict["ingredients"] = ingredients_str
    return DrinkRead(**d_dict)


@router.get("/", response_model=List[DrinkRead])
def get_all_drinks(
    offset: int = 0, limit: int = 50, session: Session = Depends(get_session)
):
    drinks = session.exec(select(Drink).offset(offset).limit(limit)).all()
    return [format_drink_read(d, session) for d in drinks]


@router.get("/search", response_model=List[DrinkRead])
def search_drinks(
    include_ingredients: Optional[str] = Query(None),
    exclude_ingredients: Optional[str] = Query(None),
    alcohol_types: Optional[str] = Query(None),
    flavors: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    offset: int = 0,
    limit: int = 50,
    session: Session = Depends(get_session),
):
    query = select(Drink)

    if category:
        query = query.where(func.lower(Drink.category) == category.lower())

    all_drinks = session.exec(query).all()
    results = []

    inc_ings = include_ingredients.lower().split(",") if include_ingredients else []
    exc_ings = exclude_ingredients.lower().split(",") if exclude_ingredients else []
    alcohols = alcohol_types.lower().split(",") if alcohol_types else []
    flav = flavors.lower().split(",") if flavors else []

    for d in all_drinks:
        if alcohols:
            d_alcs = [a.lower() for a in d.alcohol_type]
            if not any(a in d_alcs for a in alcohols):
                continue

        if flav:
            d_flavs = [f.lower() for f in d.flavors]
            if not any(f in d_flavs for f in flav):
                continue

        d_links = session.exec(
            select(DrinkIngredientLink).where(DrinkIngredientLink.drink_id == d.id)
        ).all()
        d_ing_names = []
        for l in d_links:
            ing = session.get(Ingredient, l.ingredient_id)
            if ing:
                d_ing_names.append(ing.name.lower())

        combined_str = " ".join(d_ing_names)

        if inc_ings:
            has_all = True
            for inc in inc_ings:
                inc = inc.strip()
                if inc not in combined_str:
                    has_all = False
                    break
            if not has_all:
                continue

        if exc_ings:
            has_any = False
            for exc in exc_ings:
                exc = exc.strip()
                if exc in combined_str:
                    has_any = True
                    break
            if has_any:
                continue

        results.append(format_drink_read(d, session))

    return results[offset : offset + limit]


@router.get("/random", response_model=DrinkRead)
def get_random_drink(
    include_ingredients: Optional[str] = Query(None),
    exclude_ingredients: Optional[str] = Query(None),
    alcohol_types: Optional[str] = Query(None),
    flavors: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    session: Session = Depends(get_session),
):
    results = search_drinks(
        include_ingredients,
        exclude_ingredients,
        alcohol_types,
        flavors,
        category,
        session,
    )
    if not results:
        raise HTTPException(status_code=404, detail="No drinks found")
    return random.choice(results)


@router.get("/{drink_id}", response_model=DrinkRead)
def get_drink(drink_id: str, session: Session = Depends(get_session)):
    drink = session.get(Drink, drink_id)
    if not drink:
        raise HTTPException(status_code=404, detail="Drink not found")
    return format_drink_read(drink, session)


@router.post("/", response_model=DrinkRead)
def create_drink(drink: DrinkCreate, session: Session = Depends(get_session)):
    if session.get(Drink, drink.id):
        raise HTTPException(status_code=400, detail="Drink ID already exists")

    db_drink = Drink(
        id=drink.id,
        name=drink.name,
        image=drink.image,
        category=drink.category,
        alcohol_type=drink.alcohol_type,
        instructions=drink.instructions,
        glass_type=drink.glass_type,
        flavors=drink.flavors,
        garnish=drink.garnish,
    )
    session.add(db_drink)

    for ing_str in drink.ingredients:
        pattern = r"^([\d\s\.\-/]+(?:oz|tsp|cup|cups|dashes|dash|splash|ml|cl|leaves|cube|slice|wedge|wheel|sprig|drops|drop)?)\s+(.+)$"
        match = re.match(pattern, ing_str, re.IGNORECASE)
        if match:
            measure = match.group(1).strip()
            name = match.group(2).strip()
        else:
            measure = ""
            name = ing_str.strip()

        target_name = name.title()
        ing_id = target_name.lower().replace(" ", "-")

        ingredient = session.get(Ingredient, ing_id)
        if not ingredient:
            ingredient = Ingredient(id=ing_id, name=target_name)
            session.add(ingredient)

        link = DrinkIngredientLink(
            drink_id=db_drink.id, ingredient_id=ingredient.id, measure=measure
        )
        session.add(link)

    session.commit()
    return format_drink_read(db_drink, session)
