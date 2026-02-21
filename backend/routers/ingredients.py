from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from backend.database import get_session
from backend.models import Ingredient

router = APIRouter(prefix="/api/ingredients", tags=["ingredients"])


@router.get("/", response_model=List[Ingredient])
def search_ingredients(
    query: Optional[str] = Query(None, description="Search term for ingredient name"),
    session: Session = Depends(get_session),
):
    stmt = select(Ingredient)
    if query:
        # Match substring in name or id
        stmt = stmt.where(
            Ingredient.name.contains(query, autoescape=True)
            | Ingredient.id.contains(query.lower())
        )
    stmt = stmt.order_by(Ingredient.name).limit(50)
    return session.exec(stmt).all()


@router.post("/", response_model=Ingredient)
def create_ingredient(ingredient: Ingredient, session: Session = Depends(get_session)):
    if session.get(Ingredient, ingredient.id):
        raise HTTPException(status_code=400, detail="Ingredient already exists")
    session.add(ingredient)
    session.commit()
    session.refresh(ingredient)
    return ingredient
