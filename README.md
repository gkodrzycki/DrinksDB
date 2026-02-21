# DrinksDB 🍸

A full-stack home bar application for managing and discovering cocktail recipes. Search by ingredients, get random drink suggestions, and explore collection of cocktails.

## Screenshots

### Main Page
![DrinksDB Main Page](images/screenshot-main.png)
*Browse all drinks with advanced search filters and a responsive grid layout*

### Drink Detail
![Drink Recipe Detail](images/screenshot-detail.png)
*View complete recipes with ingredients, instructions, and flavor profiles*

## Features

- 🔍 **Advanced Search** - Filter drinks by including/excluding ingredients
- 🎲 **Random Drink** - Get random suggestions with optional constraints
- 📱 **Fully Responsive** - Beautiful on mobile, tablet, and desktop
- 🐳 **Docker Ready** - One-command deployment
- ⚡ **Fast API** - Built with FastAPI

## Tech Stack

- **Backend**: Python 3.11+ with FastAPI
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Dependency Management**: UV
- **Containerization**: Docker & Docker Compose
- **Data Storage**: JSON file (easily replaceable with database)

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Build and run with docker-compose
docker-compose up --build

# Access the app at http://localhost:8000
```

### Option 2: Local Development

```bash
# Install UV if you haven't already
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies
uv pip install -r pyproject.toml

# Run the development server
uv run uvicorn backend.main:app --reload

# Access the app at http://localhost:8000
```

## Project Structure

```
DrinksDB/
├── backend/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── database.py          # SQLite database connection setup
│   ├── migrate_json_to_db.py# Migration script for old JSON data
│   ├── models.py            # SQLModel database tables & Pydantic models
│   └── routers/
│       └── drinks.py        # API endpoints
├── frontend/
│   ├── index.html           # Main HTML
│   ├── style.css            # Styles
│   └── app.js               # Frontend logic
├── data/
│   └── drinks.db            # SQLite Drink recipes database
├── images/                  # Drink images (optional)
├── pyproject.toml           # Python dependencies
├── Dockerfile               # Docker configuration
└── docker-compose.yml       # Docker Compose setup
```

## API Endpoints

- `GET /api/drinks/` - Get all drinks (paginated)
- `GET /api/drinks/{id}` - Get specific drink by ID
- `GET /api/drinks/search` - Search drinks with filters
  - Query params: `include_ingredients`, `exclude_ingredients`, `alcohol_types`, `flavors`, `category`, `offset`, `limit`
- `POST /api/drinks/` - Create a custom drink recipe
- `GET /api/drinks/random` - Get random drink (supports same filters)
- `GET /api/health` - Health check

## Adding Your Own Drinks

You can add new custom recipes easily using the "+ Add Recipe" button available on the top right corner of the website. It supports adding names, ingredients, instructions, and even custom images.

If you are developing locally, drinks will be persistently saved into your local `data/drinks.db` SQLite database.

## Adding Images

1. Place drink images in the `images/` directory
2. Reference them in the app as `/images/your-image.jpg` or just provide any absolute URL like `https://example.com/mock.jpg`.
3. The app will automatically serve local images and external URLs.

## Development

The app supports hot-reloading in development:

```bash
# Backend with auto-reload
uv run uvicorn backend.main:app --reload

# Or with docker-compose (volumes are mounted)
docker-compose up
```

## Future plans
- [x] Probably worth moving drinks to database
- [ ] Host it somewhere?
- [x] Add easier way to add new recipes (maybe a form/api?)
- [ ] Improve get random drink logic, it takes random drink only from first 50 drinks (or whatever limit is set to)