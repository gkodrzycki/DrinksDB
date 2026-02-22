// ==========================================
// Internationalization (i18n)
// ==========================================

const translations = {
    en: {
        // Header
        subtitle: 'Your Personal Home Bar Companion',
        addRecipe: '+ Add Recipe',

        // Filters
        filterHeading: 'Find Your Perfect Drink',
        labelInclude: 'Include Ingredients (comma-separated)',
        labelExclude: 'Exclude Ingredients (comma-separated)',
        labelAlcohol: 'Alcohol Type (comma-separated)',
        labelFlavors: 'Flavors (comma-separated)',
        labelCategory: 'Category',
        phInclude: 'e.g., rum, lime, mint',
        phExclude: 'e.g., whisky, tequila',
        phAlcohol: 'e.g., vodka, gin',
        phFlavors: 'e.g., sweet, sour, fruity',
        phCategory: 'e.g., Cocktail, Mocktail, Shot',

        // Buttons
        searchBtn: 'Search Drinks',
        randomBtn: 'Get Random Drink',
        clearBtn: 'Clear Filters',
        deleteBtn: '🗑️ Delete Recipe',
        saveBtn: 'Save Recipe',

        // Add Recipe Modal
        addRecipeHeading: 'Add New Recipe',
        labelDrinkId: 'Drink ID (unique, lowercase w/ dashes)',
        labelName: 'Name',
        labelImage: 'Image URL (optional)',
        labelCategoryForm: 'Category',
        labelIngredients: 'Ingredients',
        labelInstructions: 'Instructions',
        phDrinkId: 'e.g. custom-mojito',
        phName: 'e.g. Custom Mojito',
        phImage: 'e.g. https://example.com/image.jpg',
        phCategoryForm: 'e.g. Cocktail',
        phIngredient: 'e.g. 2 oz Dark Rum',
        phInstruction: 'e.g. Shake with ice',
        addBtn: 'Add',

        // Drink Detail Modal
        alcohol: 'Alcohol:',
        glass: 'Glass:',
        garnish: 'Garnish:',
        ingredients: 'Ingredients',
        instructions: 'Instructions',
        flavorProfile: 'Flavor Profile',

        // Dynamic messages
        loading: 'Loading drinks',
        loadingMore: 'Loading more drinks...',
        noResults: '🔍 No drinks found',
        noResultsHint: 'Try adjusting your filters or clearing them to see all drinks.',
        errorLoad: 'Failed to load drinks. Please try again.',
        errorRandom: 'Failed to get random drink. Please try again.',
        noMatchRandom: 'No drinks found matching your criteria.',
        errorDelete: 'Failed to delete recipe. Please try again.',
        confirmDelete: 'Are you sure you want to permanently delete',
        alertNoIngredients: 'Please add at least one ingredient!',
        alertNoInstructions: 'Please add at least one instruction step!',
        alertRecipeAdded: 'Recipe added successfully!',
        alertSaveFailed: 'Failed to save recipe',
        nonAlcoholic: 'Non-alcoholic',
    },

    pl: {
        // Header
        subtitle: 'Twój Osobisty Barowy Towarzysz',
        addRecipe: '+ Dodaj Przepis',

        // Filters
        filterHeading: 'Znajdź Idealnego Drinka',
        labelInclude: 'Zawiera składniki (oddzielone przecinkami)',
        labelExclude: 'Wyklucz składniki (oddzielone przecinkami)',
        labelAlcohol: 'Rodzaj alkoholu (oddzielone przecinkami)',
        labelFlavors: 'Smaki (oddzielone przecinkami)',
        labelCategory: 'Kategoria',
        phInclude: 'np. rum, limonka, mięta',
        phExclude: 'np. whisky, tequila',
        phAlcohol: 'np. wódka, gin',
        phFlavors: 'np. słodki, kwaśny, owocowy',
        phCategory: 'np. Koktajl, Bezalkoholowy, Shot',

        // Buttons
        searchBtn: 'Szukaj Drinków',
        randomBtn: 'Losowy Drink',
        clearBtn: 'Wyczyść Filtry',
        deleteBtn: '🗑️ Usuń Przepis',
        saveBtn: 'Zapisz Przepis',

        // Add Recipe Modal
        addRecipeHeading: 'Dodaj Nowy Przepis',
        labelDrinkId: 'ID Drinka (unikalne, małe litery z myślnikami)',
        labelName: 'Nazwa',
        labelImage: 'URL Obrazka (opcjonalnie)',
        labelCategoryForm: 'Kategoria',
        labelIngredients: 'Składniki',
        labelInstructions: 'Instrukcje',
        phDrinkId: 'np. mojito-klasyczne',
        phName: 'np. Klasyczne Mojito',
        phImage: 'np. https://example.com/image.jpg',
        phCategoryForm: 'np. Koktajl',
        phIngredient: 'np. 60 ml Ciemny Rum',
        phInstruction: 'np. Wstrząsnąć z lodem',
        addBtn: 'Dodaj',

        // Drink Detail Modal
        alcohol: 'Alkohol:',
        glass: 'Szkło:',
        garnish: 'Dekoracja:',
        ingredients: 'Składniki',
        instructions: 'Instrukcje',
        flavorProfile: 'Profil Smakowy',

        // Dynamic messages
        loading: 'Ładowanie drinków',
        loadingMore: 'Ładowanie kolejnych drinków...',
        noResults: '🔍 Nie znaleziono drinków',
        noResultsHint: 'Spróbuj zmienić filtry lub je wyczyścić, aby zobaczyć wszystkie drinki.',
        errorLoad: 'Nie udało się załadować drinków. Spróbuj ponownie.',
        errorRandom: 'Nie udało się wylosować drinka. Spróbuj ponownie.',
        noMatchRandom: 'Nie znaleziono drinków pasujących do kryteriów.',
        errorDelete: 'Nie udało się usunąć przepisu. Spróbuj ponownie.',
        confirmDelete: 'Czy na pewno chcesz trwale usunąć',
        alertNoIngredients: 'Dodaj przynajmniej jeden składnik!',
        alertNoInstructions: 'Dodaj przynajmniej jeden krok instrukcji!',
        alertRecipeAdded: 'Przepis dodany pomyślnie!',
        alertSaveFailed: 'Nie udało się zapisać przepisu',
        nonAlcoholic: 'Bezalkoholowy',
    }
};

let currentLang = localStorage.getItem('drinksdb-lang') || 'en';

function t(key) {
    return translations[currentLang][key] || translations['en'][key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('drinksdb-lang', lang);
    document.documentElement.lang = lang;

    // Update all elements with data-i18n attribute (textContent)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Update all elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // Update toggle button active states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Re-render drink cards with translated content
    if (typeof fetchDrinks === 'function') {
        fetchDrinks(true);
    }
}

function initI18n() {
    setLanguage(currentLang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });
}

// ==========================================
// Ingredient & Flavor Translations
// ==========================================

const flavorTranslations = {
    'fresh': 'Świeży',
    'minty': 'Miętowy',
    'citrus': 'Cytrusowy',
    'refreshing': 'Orzeźwiający',
    'sweet': 'Słodki',
    'sour': 'Kwaśny',
    'bitter': 'Gorzki',
    'strong': 'Mocny',
    'smooth': 'Łagodny',
    'fruity': 'Owocowy',
    'tropical': 'Tropikalny',
    'spicy': 'Pikantny',
    'spiced': 'Korzenny',
    'creamy': 'Kremowy',
    'dry': 'Wytrawny',
    'tangy': 'Cierpki',
    'tart': 'Kwaśny',
    'zesty': 'Wyrazisty',
    'bold': 'Wyrazisty',
    'complex': 'Złożony',
    'aromatic': 'Aromatyczny',
    'balanced': 'Zbalansowany',
    'classic': 'Klasyczny',
    'sophisticated': 'Wyrafinowany',
    'salty': 'Słony',
    'coffee': 'Kawowy',
    'energizing': 'Energetyzujący',
    'non-alcoholic': 'Bezalkoholowy',
};

// All keys are LOWERCASE for case-insensitive lookup
const ingredientTranslations = {
    // Spirits
    'white rum': 'Biały Rum',
    'dark rum': 'Ciemny Rum',
    'gold rum': 'Złoty Rum',
    'spiced rum': 'Rum Korzenny',
    'rum': 'Rum',
    'vodka': 'Wódka',
    'gin': 'Gin',
    'tequila': 'Tequila',
    'bourbon': 'Bourbon',
    'bourbon whisky': 'Bourbon Whisky',
    'bourbon or rye whisky': 'Bourbon lub Whisky Żytnia',
    'whisky': 'Whisky',
    'rye whiskey': 'Whiskey Żytnia',
    'scotch': 'Scotch',
    'brandy': 'Brandy',
    'cognac': 'Koniak',
    'mezcal': 'Mezcal',
    'absinthe': 'Absynt',
    'champagne': 'Szampan',
    'prosecco': 'Prosecco',
    'red wine': 'Czerwone Wino',
    'white wine': 'Białe Wino',

    // Liqueurs
    'triple sec': 'Triple Sec',
    'cointreau': 'Cointreau',
    'cointreau or triple sec': 'Cointreau lub Triple Sec',
    'grand marnier': 'Grand Marnier',
    'kahlúa': 'Kahlúa',
    'coffee liqueur': 'Likier Kawowy',
    'amaretto': 'Amaretto',
    'campari': 'Campari',
    'aperol': 'Aperol',
    'chartreuse': 'Chartreuse',
    'maraschino liqueur': 'Likier Maraschino',
    'elderflower liqueur': 'Likier Bzowy',
    'crème de cassis': 'Crème De Cassis',

    // Vermouths & bitters
    'sweet vermouth': 'Wermut Słodki',
    'dry vermouth': 'Wermut Wytrawny',
    'angostura bitters': 'Angostura Bitters',
    'orange bitters': 'Bitters Pomarańczowe',
    "peychaud's bitters": 'Bitters Peychaud',

    // Juices & mixers
    'fresh lime juice': 'Świeży Sok z Limonki',
    'fresh lemon juice': 'Świeży Sok z Cytryny',
    'lime juice': 'Sok z Limonki',
    'lemon juice': 'Sok z Cytryny',
    'orange juice': 'Sok Pomarańczowy',
    'cranberry juice': 'Sok Żurawinowy',
    'pineapple juice': 'Sok Ananasowy',
    'grapefruit juice': 'Sok Grejpfrutowy',
    'tomato juice': 'Sok Pomidorowy',
    'apple juice': 'Sok Jabłkowy',
    'club soda': 'Woda Gazowana',
    'soda water': 'Woda Sodowa',
    'tonic water': 'Tonik',
    'ginger beer': 'Piwo Imbirowe',
    'ginger ale': 'Ginger Ale',
    'cola': 'Cola',
    'coconut milk': 'Mleko Kokosowe',
    'coconut cream': 'Krem Kokosowy',
    'heavy cream': 'Śmietanka',
    'cream': 'Śmietanka',
    'milk': 'Mleko',
    'espresso': 'Espresso',
    'freshly brewed espresso': 'Świeżo Zaparzone Espresso',
    'hot water': 'Gorąca Woda',
    'water': 'Woda',

    // Syrups & sweeteners
    'simple syrup': 'Syrop Cukrowy',
    'sugar syrup': 'Syrop Cukrowy',
    'honey syrup': 'Syrop Miodowy',
    'grenadine': 'Grenadyna',
    'agave syrup': 'Syrop z Agawy',
    'agave nectar': 'Nektar z Agawy',
    'maple syrup': 'Syrop Klonowy',
    'sugar': 'Cukier',
    'sugar cube': 'Kostka Cukru',
    'brown sugar': 'Cukier Brązowy',
    'demerara sugar': 'Cukier Demerara',
    'honey': 'Miód',

    // Garnishes & extras
    'mint leaves': 'Liście Mięty',
    'fresh mint leaves': 'Świeże Liście Mięty',
    'mint': 'Mięta',
    'fresh mint': 'Świeża Mięta',
    'lime': 'Limonka',
    'lime wheel': 'Plasterek Limonki',
    'lime wedge': 'Ćwiartka Limonki',
    'lemon': 'Cytryna',
    'lemon twist': 'Skórka Cytryny',
    'lemon peel': 'Skórka Cytryny',
    'orange peel': 'Skórka Pomarańczy',
    'orange twist': 'Skórka Pomarańczy',
    'orange slice': 'Plasterek Pomarańczy',
    'pineapple wedge': 'Ćwiartka Ananasa',
    'cherry': 'Wiśnia',
    'maraschino cherry': 'Wisienka Koktajlowa',
    'olive': 'Oliwka',
    'salt': 'Sól',
    'salt for rim': 'Sól na Obwódkę',
    'salt rim': 'Obwódka z Soli',
    'sugar rim': 'Obwódka z Cukru',
    'egg white': 'Białko Jajka',
    'ice': 'Lód',
    'ice cubes': 'Kostki Lodu',
    'crushed ice': 'Kruszony Lód',
    'nutmeg': 'Gałka Muszkatołowa',
    'cinnamon': 'Cynamon',
    'cinnamon stick': 'Laska Cynamonu',
    'basil': 'Bazylia',
    'cucumber': 'Ogórek',
    'ginger': 'Imbir',
    'fresh ginger': 'Świeży Imbir',
    'jalapeño': 'Jalapeño',
    'celery': 'Seler',
    'tabasco': 'Tabasco',
    'worcestershire sauce': 'Sos Worcestershire',
    'black pepper': 'Czarny Pieprz',
    'rosemary': 'Rozmaryn',
    'star anise': 'Anyż Gwiazdkowy',
    'coffee beans': 'Ziarna Kawy',
};

/**
 * Translate a flavor name if in Polish mode
 */
function translateFlavor(flavor) {
    if (currentLang === 'en') return flavor;
    return flavorTranslations[flavor.toLowerCase()] || flavor;
}

/**
 * Translate an ingredient string (e.g. "2 oz White rum" → "2 oz Biały Rum")
 * Handles case-insensitive matching and parenthetical notes like (optional)
 */
function translateIngredient(ingredientStr) {
    if (currentLang === 'en') return ingredientStr;

    // Strip parenthetical notes like (optional) or (Kahlúa) and save them
    let note = '';
    let cleanStr = ingredientStr.replace(/\s*\(([^)]+)\)\s*/g, (match, inner) => {
        // Translate known notes
        const noteLower = inner.toLowerCase();
        if (noteLower === 'optional') {
            note = ' (opcjonalnie)';
        } else if (noteLower === 'spiced rum recommended') {
            note = ' (zalecany rum korzenny)';
        } else {
            note = ` (${inner})`;
        }
        return ' ';
    }).trim();

    // Try to match "measure + ingredient name" pattern
    const match = cleanStr.match(/^([\d\s.\-/]+(?:oz|tsp|cup|cups|dashes|dash|splash|ml|cl|leaves|cube|slice|wedge|wheel|sprig|drops|drop)?)\s+(.+)$/i);
    if (match) {
        const measure = match[1].trim();
        const name = match[2].trim();
        const translated = ingredientTranslations[name.toLowerCase()] || name;
        return `${measure} ${translated}${note}`;
    }

    // No measure found, try translating the whole string
    const translated = ingredientTranslations[cleanStr.toLowerCase()] || cleanStr;
    return `${translated}${note}`;
}
