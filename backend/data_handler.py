import json
import random
from pathlib import Path
from typing import List, Optional
from backend.models import Drink, SearchFilters


class DrinksDataHandler:
    def __init__(self, data_path: str = "data/drinks.json"):
        self.data_path = Path(data_path)
        self._drinks: Optional[List[Drink]] = None

    def _load_drinks(self) -> List[Drink]:
        if not self.data_path.exists():
            return []

        with open(self.data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return [Drink(**drink) for drink in data]

    @property
    def drinks(self) -> List[Drink]:
        if self._drinks is None:
            self._drinks = self._load_drinks()
        return self._drinks

    def reload(self):
        self._drinks = None

    def get_all_drinks(self) -> List[Drink]:
        return self.drinks

    def get_drink_by_id(self, drink_id: str) -> Optional[Drink]:
        for drink in self.drinks:
            if drink.id == drink_id:
                return drink
        return None

    def search_drinks(self, filters: SearchFilters) -> List[Drink]:
        results = self.drinks.copy()

        if filters.include_ingredients:
            results = [
                drink for drink in results
                if self._has_ingredients(drink, filters.include_ingredients)
            ]

        if filters.exclude_ingredients:
            results = [
                drink for drink in results
                if not self._has_any_ingredient(drink, filters.exclude_ingredients)
            ]

        if filters.alcohol_types:
            results = [
                drink for drink in results
                if any(alcohol.lower() in [a.lower() for a in drink.alcohol_type]
                       for alcohol in filters.alcohol_types)
            ]

        if filters.flavors:
            results = [
                drink for drink in results
                if any(flavor.lower() in [f.lower() for f in drink.flavors]
                       for flavor in filters.flavors)
            ]

        if filters.category:
            results = [
                drink for drink in results
                if drink.category.lower() == filters.category.lower()
            ]

        return results

    def get_random_drink(self, filters: Optional[SearchFilters] = None) -> Optional[Drink]:
        if filters:
            eligible_drinks = self.search_drinks(filters)
        else:
            eligible_drinks = self.drinks

        if not eligible_drinks:
            return None

        return random.choice(eligible_drinks)

    def _has_ingredients(self, drink: Drink, ingredients: List[str]) -> bool:
        drink_ingredients_lower = ' '.join(drink.ingredients).lower()
        return all(ing.lower() in drink_ingredients_lower for ing in ingredients)

    def _has_any_ingredient(self, drink: Drink, ingredients: List[str]) -> bool:
        drink_ingredients_lower = ' '.join(drink.ingredients).lower()
        return any(ing.lower() in drink_ingredients_lower for ing in ingredients)
