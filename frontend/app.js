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
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreContainer = document.getElementById('loadMoreContainer');

// Input Fields
const includeIngredientsInput = document.getElementById('includeIngredients');
const excludeIngredientsInput = document.getElementById('excludeIngredients');
const alcoholTypesInput = document.getElementById('alcoholTypes');
const flavorsInput = document.getElementById('flavors');
const categoryInput = document.getElementById('category');

// Initialize App
async function init() {
    await fetchDrinks(true);
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

    // Infinite scroll observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const infiniteScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isLoading) {
                currentOffset += PAGE_LIMIT;
                fetchDrinks(false);
            }
        });
    }, observerOptions);

    if (loadMoreContainer) {
        infiniteScrollObserver.observe(loadMoreContainer);
    }

    // Allow Enter key to trigger search
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    });
}

let currentOffset = 0;
const PAGE_LIMIT = 20;
let isLoading = false;

// Load Drinks (All or Search)
async function fetchDrinks(reset = true) {
    if (isLoading) return;
    isLoading = true;

    if (reset) {
        currentOffset = 0;
        drinksContainer.innerHTML = '';
        if (loadMoreContainer) loadMoreContainer.style.display = 'none';

        // Only show full loading spinner on complete reset
        showLoading();
    }

    const filters = getFilters();
    const hasF = hasFilters(filters);

    let url = `${API_BASE_URL}/drinks/`;
    let queryString = `offset=${currentOffset}&limit=${PAGE_LIMIT}`;

    if (hasF) {
        url = `${API_BASE_URL}/drinks/search`;
        queryString += '&' + buildQueryString(filters);
    }

    try {
        const response = await fetch(`${url}?${queryString}`);
        if (!response.ok) throw new Error('Failed to fetch drinks');

        const results = await response.json();

        if (reset) drinksContainer.innerHTML = ''; // Clear loading

        if (results.length === 0 && reset) {
            showEmptyState();
            isLoading = false;
            return;
        }

        displayDrinks(results, reset);

        if (results.length < PAGE_LIMIT) {
            if (loadMoreContainer) loadMoreContainer.style.display = 'none';
        } else {
            if (loadMoreContainer) loadMoreContainer.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching drinks:', error);
        if (reset) showError('Failed to load drinks. Please try again.');
    } finally {
        isLoading = false;
    }
}

// Handle Search
function handleSearch() {
    fetchDrinks(true);
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

    fetchDrinks(true);
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
function displayDrinks(drinks, reset = true) {
    if (reset) {
        drinksContainer.innerHTML = '';
    }

    if (!drinks || drinks.length === 0) {
        if (reset) showEmptyState();
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

// Add Recipe Logic
const addRecipeBtn = document.getElementById('addRecipeBtn');
const addRecipeModal = document.getElementById('addRecipeModal');
const closeAddRecipeModal = document.getElementById('closeAddRecipeModal');
const addRecipeForm = document.getElementById('addRecipeForm');
const addIngredientBtn = document.getElementById('addIngredientBtn');
const addInstructionBtn = document.getElementById('addInstructionBtn');
const newIngredientsList = document.getElementById('newIngredientsList');
const newInstructionsList = document.getElementById('newInstructionsList');
const ingredientInput = document.getElementById('ingredientInput');
const instructionInput = document.getElementById('instructionInput');

let currentIngredients = [];
let currentInstructions = [];

// Event Listeners for Add Recipe
if (addRecipeBtn) addRecipeBtn.addEventListener('click', () => {
    addRecipeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

if (closeAddRecipeModal) closeAddRecipeModal.addEventListener('click', closeAddRecipe);
if (addRecipeForm) addRecipeForm.addEventListener('submit', handleAddRecipeSubmit);

// Add Ingredient to List
if (addIngredientBtn) addIngredientBtn.addEventListener('click', () => {
    const val = ingredientInput.value.trim();
    if (val) {
        currentIngredients.push(val);
        renderAddedLists();
        ingredientInput.value = '';
    }
});

// Add Instruction to List
if (addInstructionBtn) addInstructionBtn.addEventListener('click', () => {
    const val = instructionInput.value.trim();
    if (val) {
        currentInstructions.push(val);
        renderAddedLists();
        instructionInput.value = '';
    }
});

function renderAddedLists() {
    if (newIngredientsList) {
        newIngredientsList.innerHTML = currentIngredients.map((ing, i) => `
            <div class="added-item">
                <span>${ing}</span>
                <button type="button" class="remove-btn" onclick="removeIngredient(${i})">&times;</button>
            </div>
        `).join('');
    }

    if (newInstructionsList) {
        newInstructionsList.innerHTML = currentInstructions.map((inst, i) => `
            <div class="added-item">
                <span>${i + 1}. ${inst}</span>
                <button type="button" class="remove-btn" onclick="removeInstruction(${i})">&times;</button>
            </div>
        `).join('');
    }
}

window.removeIngredient = (index) => {
    currentIngredients.splice(index, 1);
    renderAddedLists();
};

window.removeInstruction = (index) => {
    currentInstructions.splice(index, 1);
    renderAddedLists();
};

function closeAddRecipe(e) {
    if (e) e.preventDefault();
    if (addRecipeModal) addRecipeModal.classList.remove('active');
    document.body.style.overflow = '';
}

async function handleAddRecipeSubmit(e) {
    e.preventDefault();

    if (currentIngredients.length === 0) {
        alert("Please add at least one ingredient!");
        return;
    }

    if (currentInstructions.length === 0) {
        alert("Please add at least one instruction step!");
        return;
    }

    const drinkId = document.getElementById('newDrinkId').value.trim();
    const drinkName = document.getElementById('newDrinkName').value.trim();
    const drinkCategory = document.getElementById('newDrinkCategory').value.trim();

    const newDrink = {
        id: drinkId,
        name: drinkName,
        category: drinkCategory,
        ingredients: currentIngredients,
        instructions: currentInstructions,
        alcohol_type: [],
        flavors: []
    };

    try {
        const response = await fetch(`${API_BASE_URL}/drinks/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDrink)
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || 'Failed to save recipe');
        }

        // Reset form
        addRecipeForm.reset();
        currentIngredients = [];
        currentInstructions = [];
        renderAddedLists();

        closeAddRecipe();
        alert('Recipe added successfully!');

        fetchDrinks(true);

    } catch (error) {
        console.error('Error adding recipe:', error);
        alert(error.message);
    }
}
