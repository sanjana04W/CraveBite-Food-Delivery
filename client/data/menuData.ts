export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  prepTime: string;
  calories: number;
  isVeg: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isChefSpecial?: boolean;
  isPopular?: boolean;
  image: string;
  description: string;
  ingredients: string[];
  allergens?: string[];
  spiceLevel: "Mild" | "Medium" | "Spicy" | "Extra Spicy";
  customizations?: {
    name: string;
    options: { label: string; extraPrice: number }[];
  }[];
}

export interface FoodCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  bannerImage: string;
  itemCount: number;
}

export const foodCategories: FoodCategory[] = [
  {
    id: "cat-1",
    slug: "pizzas",
    name: "Artisan Pizzas",
    icon: "Pizza",
    description: "Wood-fired stone oven pizzas with Italian mozzarella & hand-kneaded crusts.",
    bannerImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
    itemCount: 8,
  },
  {
    id: "cat-2",
    slug: "burgers",
    name: "Gourmet Burgers",
    icon: "Utensils",
    description: "Smash patties, brioche buns, aged cheddar, and house-crafted sauces.",
    bannerImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
    itemCount: 6,
  },
  {
    id: "cat-3",
    slug: "asian-bowls",
    name: "Asian & Noodles",
    icon: "Soup",
    description: "Authentic ramen broths, wok-tossed noodles, and sizzling dim sums.",
    bannerImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1200&auto=format&fit=crop",
    itemCount: 7,
  },
  {
    id: "cat-4",
    slug: "biryani-curries",
    name: "Biryani & Curries",
    icon: "Flame",
    description: "Dum pukht aromatic saffron biryanis and slow-simmered rich curries.",
    bannerImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop",
    itemCount: 5,
  },
  {
    id: "cat-5",
    slug: "healthy-salads",
    name: "Healthy Bowls & Salads",
    icon: "Salad",
    description: "Crisp organic greens, quinoa power bowls, avocados, and fresh vinaigrettes.",
    bannerImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
    itemCount: 6,
  },
  {
    id: "cat-6",
    slug: "desserts-gelato",
    name: "Desserts & Shakes",
    icon: "Coffee",
    description: "Decadent chocolate lava cakes, artisan gelatos, and creamy milkshakes.",
    bannerImage: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1200&auto=format&fit=crop",
    itemCount: 6,
  },
];

export const menuItemsData: MenuItem[] = [
  {
    id: "dish-1",
    slug: "truffle-burrata-margherita",
    name: "Truffle Burrata Margherita Pizza",
    category: "Artisan Pizzas",
    categorySlug: "pizzas",
    price: 3500,
    originalPrice: 3950,
    rating: 4.9,
    reviewCount: 342,
    prepTime: "20-25 min",
    calories: 820,
    isVeg: true,
    isChefSpecial: true,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=1000&auto=format&fit=crop",
    description: "San Marzano tomato base, creamy whole Italian burrata, black truffle drizzle, fresh sweet basil, and extra virgin olive oil on 48-hour fermented sourdough.",
    ingredients: ["San Marzano Tomatoes", "Fior di Latte Mozzarella", "Fresh Burrata Ball", "Black Truffle Oil", "Fresh Basil", "Sourdough Crust"],
    allergens: ["Gluten", "Dairy"],
    spiceLevel: "Mild",
    customizations: [
      {
        name: "Crust Choice",
        options: [
          { label: "Classic Wood-fired Sourdough", extraPrice: 0 },
          { label: "Stuffed Garlic Cheese Crust", extraPrice: 2.99 },
          { label: "Gluten-Free Cauliflower Crust", extraPrice: 3.50 }
        ]
      },
      {
        name: "Extra Toppings",
        options: [
          { label: "Extra Fresh Burrata", extraPrice: 3.99 },
          { label: "Kalamata Olives & Sun-dried Tomatoes", extraPrice: 1.99 },
          { label: "Fresh Jalapeño Peppers", extraPrice: 0.99 }
        ]
      }
    ]
  },
  {
    id: "dish-2",
    slug: "double-smash-wagyu-cheeseburger",
    name: "Double Smash Wagyu Cheeseburger",
    category: "Gourmet Burgers",
    categorySlug: "burgers",
    price: 1500,
    originalPrice: 1850,
    rating: 4.95,
    reviewCount: 512,
    prepTime: "15-20 min",
    calories: 910,
    isVeg: false,
    isChefSpecial: true,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop",
    description: "Two 100% prime Wagyu beef patties smashed crispy, double aged Wisconsin cheddar, caramelized balsamic onions, dill pickles, and secret Crave sauce on toasted brioche.",
    ingredients: ["Prime Wagyu Beef", "Brioche Bun", "Aged Cheddar", "Caramelized Onions", "House Crave Sauce", "Dill Pickles"],
    allergens: ["Gluten", "Dairy", "Egg"],
    spiceLevel: "Medium",
    customizations: [
      {
        name: "Side Choice",
        options: [
          { label: "Crispy Golden Fries (Included)", extraPrice: 0 },
          { label: "Parmesan Truffle Fries", extraPrice: 2.50 },
          { label: "Beer-Battered Onion Rings", extraPrice: 2.99 }
        ]
      },
      {
        name: "Patty Add-on",
        options: [
          { label: "Add Crispy Smoked Bacon", extraPrice: 2.00 },
          { label: "Add Extra Wagyu Patty", extraPrice: 4.50 },
          { label: "Add Fried Egg", extraPrice: 1.50 }
        ]
      }
    ]
  },
  {
    id: "dish-3",
    slug: "tokyo-black-garlic-tonkotsu-ramen",
    name: "Tokyo Black Garlic Tonkotsu Ramen",
    category: "Asian & Noodles",
    categorySlug: "asian-bowls",
    price: 2580,
    originalPrice: 3100,
    rating: 4.88,
    reviewCount: 289,
    prepTime: "15-20 min",
    calories: 760,
    isVeg: false,
    isChefSpecial: true,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1000&auto=format&fit=crop",
    description: "16-hour rich pork bone broth infused with charred black garlic oil, hand-pulled ramen noodles, slow-braised chashu pork belly, ajitsuke tamago egg, menma, and nori.",
    ingredients: ["Rich Tonkotsu Broth", "Chashu Pork Belly", "Nitadago Soft-boiled Egg", "Charred Black Garlic Oil", "Nori", "Handcrafted Ramen"],
    allergens: ["Gluten", "Soy", "Egg"],
    spiceLevel: "Medium",
  },
  {
    id: "dish-4",
    slug: "hyderabadi-dum-chicken-biryani",
    name: "Royal Hyderabadi Dum Biryani",
    category: "Biryani & Curries",
    categorySlug: "biryani-curries",
    price: 1890,
    originalPrice: 2250,
    rating: 4.92,
    reviewCount: 640,
    prepTime: "20-25 min",
    calories: 850,
    isVeg: false,
    isChefSpecial: false,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000&auto=format&fit=crop",
    description: "Long-grain aged basmati rice cooked on slow dum with tender marinated chicken, saffron strands, rose water, fried onions, and served with spiced mirchi ka salan and cucumber raita.",
    ingredients: ["Aged Basmati Rice", "Tender Chicken", "Pure Saffron", "Shahi Garam Masala", "Mint & Coriander", "Ghee"],
    allergens: ["Dairy"],
    spiceLevel: "Spicy",
  },
  {
    id: "dish-5",
    slug: "avocado-quinoa-power-bowl",
    name: "Avocado & Edamame Superfood Bowl",
    category: "Healthy Bowls & Salads",
    categorySlug: "healthy-salads",
    price: 1250,
    rating: 4.82,
    reviewCount: 195,
    prepTime: "10-15 min",
    calories: 490,
    isVeg: true,
    isVegan: true,
    isGlutenFree: true,
    isChefSpecial: false,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop",
    description: "Organic tricolor quinoa, Hass avocado slices, steamed edamame, roasted chickpeas, purple cabbage, cherry tomatoes, and ginger-tahini dressing.",
    ingredients: ["Tricolor Quinoa", "Hass Avocado", "Edamame", "Roasted Chickpeas", "Cherry Tomatoes", "Sesame Tahini Dressing"],
    allergens: ["Sesame"],
    spiceLevel: "Mild",
  },
  {
    id: "dish-6",
    slug: "molten-belgian-chocolate-lava-cake",
    name: "Molten Belgian Chocolate Lava Cake",
    category: "Desserts & Shakes",
    categorySlug: "desserts-gelato",
    price: 950,
    rating: 4.97,
    reviewCount: 420,
    prepTime: "12-15 min",
    calories: 580,
    isVeg: true,
    isChefSpecial: true,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000&auto=format&fit=crop",
    description: "Warm 70% dark Belgian chocolate cake with an oozing liquid ganache core, served with a scoop of Madagascar vanilla bean gelato and berry coulis.",
    ingredients: ["Belgian Dark Chocolate 70%", "Madagascar Vanilla Gelato", "Fresh Berries", "Organic Butter", "Cocoa Powder"],
    allergens: ["Gluten", "Dairy", "Egg"],
    spiceLevel: "Mild",
  },
  {
    id: "dish-7",
    slug: "spicy-firecracker-chicken-wings",
    name: "Firecracker Crispy Buffalo Wings",
    category: "Gourmet Burgers",
    categorySlug: "burgers",
    price: 1450,
    originalPrice: 1690,
    rating: 4.86,
    reviewCount: 310,
    prepTime: "15 min",
    calories: 680,
    isVeg: false,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=1000&auto=format&fit=crop",
    description: "8 jumbo crispy fried wings tossed in honey-habanero glaze, sprinkled with toasted sesame seeds and served with blue cheese dip and celery sticks.",
    ingredients: ["Crispy Chicken Wings", "Honey Habanero Glaze", "Blue Cheese Dip", "Celery", "Toasted Sesame"],
    allergens: ["Dairy", "Sesame"],
    spiceLevel: "Extra Spicy",
  },
  {
    id: "dish-8",
    slug: "creamy-butter-chicken-naan-combo",
    name: "Murgh Makhani (Butter Chicken) & Butter Naan",
    category: "Biryani & Curries",
    categorySlug: "biryani-curries",
    price: 1750,
    rating: 4.94,
    reviewCount: 580,
    prepTime: "20 min",
    calories: 890,
    isVeg: false,
    isChefSpecial: true,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=1000&auto=format&fit=crop",
    description: "Clay-oven smoked tandoori chicken tikka simmered in a velvety tomato, cashew, and fenugreek cream gravy. Served with 2 hot garlic butter naans.",
    ingredients: ["Tandoori Chicken Tikka", "Makhani Cashew Gravy", "Garlic Butter Naan", "Kasuri Methi", "Fresh Cream"],
    allergens: ["Dairy", "Nuts", "Gluten"],
    spiceLevel: "Medium",
  },
  {
    id: "dish-9",
    slug: "spicy-pepperoni-hot-honey-pizza",
    name: "Spicy Pepperoni & Hot Honey Artisan Pizza",
    category: "Artisan Pizzas",
    categorySlug: "pizzas",
    price: 2990,
    originalPrice: 3110,
    rating: 4.93,
    reviewCount: 412,
    prepTime: "20-25 min",
    calories: 880,
    isVeg: false,
    isChefSpecial: true,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1000&auto=format&fit=crop",
    description: "Crispy-edged artisan beef pepperoni cups, shredded mozzarella, spicy habanero hot honey drizzle, fresh oregano, and San Marzano tomato sauce on charred sourdough crust.",
    ingredients: ["Artisan Pepperoni", "Fior di Latte Mozzarella", "Hot Honey Drizzle", "San Marzano Sauce", "Fresh Oregano", "48-hr Sourdough"],
    allergens: ["Gluten", "Dairy"],
    spiceLevel: "Medium",
    customizations: [
      {
        name: "Crust Style",
        options: [
          { label: "Classic Wood-fired Sourdough", extraPrice: 0 },
          { label: "Stuffed Garlic Mozzarella Crust", extraPrice: 2.99 },
          { label: "Gluten-Free Cauliflower Base", extraPrice: 3.50 }
        ]
      },
      {
        name: "Spice Level",
        options: [
          { label: "Standard Hot Honey", extraPrice: 0 },
          { label: "Extra Fiery Ghost Pepper Honey", extraPrice: 1.50 }
        ]
      }
    ]
  },
  {
    id: "dish-10",
    slug: "smoked-bbq-bacon-brisket-burger",
    name: "Smoked BBQ Bacon & Brisket Burger",
    category: "Gourmet Burgers",
    categorySlug: "burgers",
    price: 1200,
    originalPrice: 1550,
    rating: 4.89,
    reviewCount: 380,
    prepTime: "15-20 min",
    calories: 940,
    isVeg: false,
    isChefSpecial: false,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=1000&auto=format&fit=crop",
    description: "Slow-smoked beef brisket piled on a 100% Wagyu patty with thick-cut hickory smoked bacon, Vermont white cheddar, crispy onion tanglers, and smoky bourbon BBQ glaze.",
    ingredients: ["Wagyu Patty", "Smoked Brisket", "Hickory Bacon", "White Cheddar", "Crispy Onions", "Bourbon BBQ Sauce", "Brioche Bun"],
    allergens: ["Gluten", "Dairy", "Egg"],
    spiceLevel: "Mild",
    customizations: [
      {
        name: "Sides",
        options: [
          { label: "Seasoned Waffle Fries", extraPrice: 0 },
          { label: "Truffle Parmesan Fries", extraPrice: 2.50 },
          { label: "Crispy Sweet Potato Wedges", extraPrice: 2.00 }
        ]
      }
    ]
  },
  {
    id: "dish-11",
    slug: "korean-fried-chicken-bao-buns",
    name: "Crispy Korean Fried Chicken Bao Buns",
    category: "Asian & Noodles",
    categorySlug: "asian-bowls",
    price: 1450,
    rating: 4.91,
    reviewCount: 265,
    prepTime: "15 min",
    calories: 620,
    isVeg: false,
    isChefSpecial: true,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1000&auto=format&fit=crop",
    description: "3 pillowy steamed lotus leaf bao buns stuffed with twice-fried crispy chicken glazed in sweet gochujang, pickled daikon radish, spicy kewpie mayo, and toasted peanuts.",
    ingredients: ["Lotus Leaf Steamed Bao", "Crispy Fried Chicken", "Gochujang Glaze", "Pickled Daikon", "Spicy Kewpie", "Crushed Peanuts"],
    allergens: ["Gluten", "Soy", "Egg", "Nuts"],
    spiceLevel: "Spicy",
  },
  {
    id: "dish-12",
    slug: "paneer-tikka-makhani-roll",
    name: "Paneer Tikka Makhani Sourdough Roll",
    category: "Biryani & Curries",
    categorySlug: "biryani-curries",
    price: 990,
    originalPrice: 1250,
    rating: 4.87,
    reviewCount: 310,
    prepTime: "12-15 min",
    calories: 640,
    isVeg: true,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1000&auto=format&fit=crop",
    description: "Charcoal tandoor grilled cottage cheese cubes glazed in aromatic makhani sauce, wrapped in a flaky handmade multi-grain paratha with mint-coriander emulsion and pickled shallots.",
    ingredients: ["Char-grilled Paneer", "Makhani Gravy", "Layered Paratha", "Mint Chutney", "Pickled Onions", "Kasuri Methi"],
    allergens: ["Dairy", "Gluten"],
    spiceLevel: "Medium",
  },
  {
    id: "dish-13",
    slug: "mediterranean-grilled-salmon-bowl",
    name: "Mediterranean Grilled Salmon Power Bowl",
    category: "Healthy Bowls & Salads",
    categorySlug: "healthy-salads",
    price: 1540,
    rating: 4.96,
    reviewCount: 220,
    prepTime: "15-18 min",
    calories: 520,
    isVeg: false,
    isGlutenFree: true,
    isChefSpecial: true,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop",
    description: "Pan-seared Atlantic salmon fillet over herbed wild brown rice, baby spinach, Kalamata olives, diced Persian cucumbers, heirloom cherry tomatoes, crumbled feta, and Greek lemon-oregano vinaigrette.",
    ingredients: ["Atlantic Salmon Fillet", "Herbed Brown Rice", "Baby Spinach", "Kalamata Olives", "Feta Cheese", "Lemon Oregano Dressing"],
    allergens: ["Fish", "Dairy"],
    spiceLevel: "Mild",
  },
  {
    id: "dish-14",
    slug: "quattro-formaggi-four-cheese-pizza",
    name: "Classic Four-Cheese Quattro Formaggi Pizza",
    category: "Artisan Pizzas",
    categorySlug: "pizzas",
    price: 2700,
    rating: 4.85,
    reviewCount: 198,
    prepTime: "20 min",
    calories: 840,
    isVeg: true,
    isPopular: false,
    image: "https://images.unsplash.com/photo-1573821663912-569905455b1c?q=80&w=1000&auto=format&fit=crop",
    description: "A rich white pizza combining creamy Fior di Latte mozzarella, Italian Gorgonzola Dolce, sharp aged Pecorino Romano, and melted Fontina cheese garnished with wild thyme and clover honey.",
    ingredients: ["Fior di Latte Mozzarella", "Gorgonzola Dolce", "Pecorino Romano", "Fontina Cheese", "Wild Thyme", "Sourdough Crust"],
    allergens: ["Gluten", "Dairy"],
    spiceLevel: "Mild",
  },
  {
    id: "dish-15",
    slug: "szechuan-fiery-dan-dan-noodles",
    name: "Szechuan Fiery Dan Dan Noodles",
    category: "Asian & Noodles",
    categorySlug: "asian-bowls",
    price: 1680,
    originalPrice: 18.00,
    rating: 4.90,
    reviewCount: 345,
    prepTime: "15 min",
    calories: 710,
    isVeg: false,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000&auto=format&fit=crop",
    description: "Springy fresh wheat noodles swimming in a rich chili sesame broth topped with wok-seared minced pork, fragrant Szechuan peppercorn oil, blanched baby bok choy, and toasted crushed peanuts.",
    ingredients: ["Fresh Wheat Noodles", "Minced Pork", "Szechuan Chili Oil", "Sesame Paste", "Baby Bok Choy", "Crushed Peanuts", "Scallions"],
    allergens: ["Gluten", "Soy", "Sesame", "Nuts"],
    spiceLevel: "Extra Spicy",
  },
  {
    id: "dish-16",
    slug: "royal-kashmiri-lamb-rogan-josh",
    name: "Royal Lamb Shank Rogan Josh",
    category: "Biryani & Curries",
    categorySlug: "biryani-curries",
    price: 1150,
    rating: 4.98,
    reviewCount: 460,
    prepTime: "25 min",
    calories: 920,
    isVeg: false,
    isChefSpecial: true,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1000&auto=format&fit=crop",
    description: "Fork-tender slow-braised Australian lamb shank in a velvet Kashmiri gravy infused with ratanjot, Kashmiri red chilies, black cardamom, fennel, and saffron. Served with aromatic cumin basmati pilaf.",
    ingredients: ["Braised Lamb Shank", "Kashmiri Chili Gravy", "Cumin Basmati Rice", "Black Cardamom", "Saffron Garnish"],
    allergens: ["Dairy"],
    spiceLevel: "Spicy",
  },
  {
    id: "dish-17",
    slug: "sicilian-pistachio-gelato-shake",
    name: "Artisan Sicilian Pistachio Gelato Shake",
    category: "Desserts & Shakes",
    categorySlug: "desserts-gelato",
    price: 1350,
    rating: 4.93,
    reviewCount: 290,
    prepTime: "8 min",
    calories: 460,
    isVeg: true,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1000&auto=format&fit=crop",
    description: "Thick artisan milkshake churned with slow-roasted Sicilian Bronte pistachio paste, organic whole milk gelato, a whipped Madagascar cream crown, and salted pistachio dust.",
    ingredients: ["Sicilian Pistachio Paste", "Vanilla Gelato", "Whole Milk", "Whipped Cream", "Crushed Roasted Pistachios"],
    allergens: ["Dairy", "Nuts"],
    spiceLevel: "Mild",
  },
  {
    id: "dish-18",
    slug: "crunchy-falafel-hummus-buddha-bowl",
    name: "Crunchy Falafel & Hummus Buddha Bowl",
    category: "Healthy Bowls & Salads",
    categorySlug: "healthy-salads",
    price: 1250,
    originalPrice: 1590,
    rating: 4.88,
    reviewCount: 215,
    prepTime: "12 min",
    calories: 480,
    isVeg: true,
    isVegan: true,
    isGlutenFree: false,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1000&auto=format&fit=crop",
    description: "Golden herb-crusted chickpea falafels with velvety roasted garlic hummus, parsley tabbouleh, pickled pink turnips, mixed garden greens, warm za'atar pita crisps, and lemon-tahini swirl.",
    ingredients: ["Chickpea Herb Falafels", "Roasted Garlic Hummus", "Tabbouleh", "Pickled Turnips", "Pita Crisps", "Lemon Tahini Dressing"],
    allergens: ["Gluten", "Sesame"],
    spiceLevel: "Mild",
  }
];

export const specialOffers = [
  {
    id: "offer-1",
    code: "CRAVE20",
    discount: "20% OFF",
    title: "Weekend Feast Deal",
    description: "Get 20% off on all orders above Rs. 25. Use code at checkout.",
    bgGradient: "from-amber-500 to-orange-600",
    badge: "Most Popular"
  },
  {
    id: "offer-2",
    code: "FREESHIP",
    discount: "FREE DELIVERY",
    title: "Free Doorstep Delivery",
    description: "Valid on all orders above Rs. 20 across the city with live GPS tracking.",
    bgGradient: "from-emerald-500 to-teal-700",
    badge: "Limited Time"
  },
  {
    id: "offer-3",
    code: "TASTY50",
    discount: "50% OFF",
    title: "First Order Special",
    description: "Welcome to CraveBite! Enjoy half-price on your first delicious order.",
    bgGradient: "from-rose-500 to-red-700",
    badge: "New Users"
  }
];
