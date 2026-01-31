// API Configuration
const API_BASE_URL = '/api';

// State
let allDrinks = [];
let currentDrink = null;

// DOM Elements
const drinksContainer = document.getElementById('drinksContainer');
const modal = document.getElementById('drinkModal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');
const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const clearBtn = document.getElementById('clearBtn');

// Input Fields
const includeIngredientsInput = document.getElementById('includeIngredients');
const excludeIngredientsInput = document.getElementById('excludeIngredients');
const alcoholTypesInput = document.getElementById('alcoholTypes');
const flavorsInput = document.getElementById('flavors');
const categoryInput = document.getElementById('category');

// Initialize App
async function init() {
    await loadAllDrinks();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    randomBtn.addEventListener('click', handleRandomDrink);
    clearBtn.addEventListener('click', handleClearFilters);
    closeModalBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Allow Enter key to trigger search
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    });
}

// Load All Drinks
async function loadAllDrinks() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/drinks/`);
        if (!response.ok) throw new Error('Failed to fetch drinks');

        allDrinks = await response.json();
        displayDrinks(allDrinks);
    } catch (error) {
        console.error('Error loading drinks:', error);
        showError('Failed to load drinks. Please try again.');
    }
}

// Handle Search
async function handleSearch() {
    const filters = getFilters();

    // If no filters, show all drinks
    if (!hasFilters(filters)) {
        displayDrinks(allDrinks);
        return;
    }

    try {
        showLoading();
        const queryString = buildQueryString(filters);
        const response = await fetch(`${API_BASE_URL}/drinks/search?${queryString}`);

        if (!response.ok) throw new Error('Search failed');

        const results = await response.json();
        displayDrinks(results);
    } catch (error) {
        console.error('Error searching drinks:', error);
        showError('Search failed. Please try again.');
    }
}

// Handle Random Drink
async function handleRandomDrink() {
    const filters = getFilters();

    try {
        const queryString = buildQueryString(filters);
        const url = queryString
            ? `${API_BASE_URL}/drinks/random?${queryString}`
            : `${API_BASE_URL}/drinks/random`;

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                showError('No drinks found matching your criteria.');
                return;
            }
            throw new Error('Failed to get random drink');
        }

        const drink = await response.json();
        showDrinkModal(drink);
    } catch (error) {
        console.error('Error getting random drink:', error);
        showError('Failed to get random drink. Please try again.');
    }
}

// Handle Clear Filters
function handleClearFilters() {
    includeIngredientsInput.value = '';
    excludeIngredientsInput.value = '';
    alcoholTypesInput.value = '';
    flavorsInput.value = '';
    categoryInput.value = '';

    displayDrinks(allDrinks);
}

// Get Filters from Inputs
function getFilters() {
    return {
        include_ingredients: includeIngredientsInput.value.trim(),
        exclude_ingredients: excludeIngredientsInput.value.trim(),
        alcohol_types: alcoholTypesInput.value.trim(),
        flavors: flavorsInput.value.trim(),
        category: categoryInput.value.trim()
    };
}

// Check if any filters are set
function hasFilters(filters) {
    return Object.values(filters).some(val => val !== '');
}

// Build Query String
function buildQueryString(filters) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            params.append(key, value);
        }
    });

    return params.toString();
}

// Display Drinks
function displayDrinks(drinks) {
    drinksContainer.innerHTML = '';

    if (!drinks || drinks.length === 0) {
        showEmptyState();
        return;
    }

    drinks.forEach(drink => {
        const card = createDrinkCard(drink);
        drinksContainer.appendChild(card);
    });
}

// Create Drink Card
function createDrinkCard(drink) {
    const card = document.createElement('div');
    card.className = 'drink-card';
    card.onclick = () => showDrinkModal(drink);

    const imageSrc = drink.image || '';
    const alcoholTypes = drink.alcohol_type?.join(', ') || 'Non-alcoholic';

    card.innerHTML = `
        ${imageSrc ? `<img src="${imageSrc}" alt="${drink.name}" class="drink-image">` : '<div class="drink-image"></div>'}
        <div class="drink-info">
            <h3 class="drink-name">${drink.name}</h3>
            <span class="drink-category">${drink.category}</span>
            <p style="color: var(--text-secondary); margin-top: var(--spacing-xs); font-size: 0.9rem;">
                ${alcoholTypes}
            </p>
            <div class="drink-tags">
                ${drink.flavors?.map(flavor => `<span class="tag">${flavor}</span>`).join('') || ''}
            </div>
        </div>
    `;

    return card;
}

// Show Drink Modal
function showDrinkModal(drink) {
    currentDrink = drink;

    const imageSrc = drink.image || '';
    const alcoholTypes = drink.alcohol_type?.join(', ') || 'Non-alcoholic';

    modalBody.innerHTML = `
        ${imageSrc ? `<img src="${imageSrc}" alt="${drink.name}" class="modal-image">` : '<div class="modal-image"></div>'}
        <h2 class="drink-name">${drink.name}</h2>
        <span class="drink-category">${drink.category}</span>
        <p style="color: var(--text-secondary); margin: var(--spacing-sm) 0;">
            <strong>Alcohol:</strong> ${alcoholTypes}
        </p>
        ${drink.glass_type ? `<p style="color: var(--text-secondary);"><strong>Glass:</strong> ${drink.glass_type}</p>` : ''}
        ${drink.garnish ? `<p style="color: var(--text-secondary);"><strong>Garnish:</strong> ${drink.garnish}</p>` : ''}

        <div class="ingredients-list">
            <h3>Ingredients</h3>
            <ul>
                ${drink.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>

        <div class="instructions-list">
            <h3>Instructions</h3>
            <ol>
                ${drink.instructions.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>

        ${drink.flavors?.length ? `
            <div style="margin-top: var(--spacing-lg);">
                <h3 style="color: var(--primary-light); margin-bottom: var(--spacing-sm);">Flavor Profile</h3>
                <div class="drink-tags">
                    ${drink.flavors.map(flavor => `<span class="tag">${flavor}</span>`).join('')}
                </div>
            </div>
        ` : ''}
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Show Loading State
function showLoading() {
    drinksContainer.innerHTML = '<div class="loading">Loading drinks</div>';
}

// Show Error
function showError(message) {
    drinksContainer.innerHTML = `
        <div class="empty-state">
            <h3>⚠️ ${message}</h3>
        </div>
    `;
}

// Show Empty State
function showEmptyState() {
    drinksContainer.innerHTML = `
        <div class="empty-state">
            <h3>🔍 No drinks found</h3>
            <p>Try adjusting your filters or clearing them to see all drinks.</p>
        </div>
    `;
}

// Start the app
init();
