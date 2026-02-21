import json
import re

from sqlmodel import Session

from backend.database import create_db_and_tables, engine
from backend.models import Drink, DrinkIngredientLink, Ingredient


def parse_ingredient(ingredient_str: str):
    pattern = r"^([\d\s\.\-/]+(?:oz|tsp|cup|cups|dashes|dash|splash|ml|cl|leaves|cube|slice|wedge|wheel|sprig|drops|drop)?)\s+(.+)$"
    match = re.match(pattern, ingredient_str, re.IGNORECASE)
    if match:
        measure = match.group(1).strip()
        name = match.group(2).strip()
    else:
        measure = ""
        name = ingredient_str.strip()
    return measure, name.title()


def main():
    print("Creating tables...")
    create_db_and_tables()

    print("Loading drinks.json...")
    with open("data/drinks.json", "r", encoding="utf-8") as f:
        drinks_data = json.load(f)

    with Session(engine) as session:
        for d_data in drinks_data:
            # Check if drink already exists
            if session.get(Drink, d_data["id"]):
                print(f"Drink {d_data['id']} already exists. Skipping.")
                continue

            drink = Drink(
                id=d_data["id"],
                name=d_data["name"],
                image=d_data.get("image"),
                category=d_data["category"],
                alcohol_type=d_data.get("alcohol_type", []),
                instructions=d_data.get("instructions", []),
                glass_type=d_data.get("glass_type"),
                flavors=d_data.get("flavors", []),
                garnish=d_data.get("garnish"),
            )
            session.add(drink)

            for ing_str in d_data.get("ingredients", []):
                measure, target_name = parse_ingredient(ing_str)
                ing_id = target_name.lower().replace(" ", "-")

                ingredient = session.get(Ingredient, ing_id)
                if not ingredient:
                    ingredient = Ingredient(id=ing_id, name=target_name)
                    session.add(ingredient)

                link = DrinkIngredientLink(
                    drink_id=drink.id, ingredient_id=ing_id, measure=measure
                )
                session.add(link)

        session.commit()
        print("Migration complete!")


if __name__ == "__main__":
    main()
