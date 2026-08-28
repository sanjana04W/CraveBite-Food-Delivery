export interface PracticeArea {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  overviewDescription: string;
  services: {
    icon: string;
    title: string;
    description: string;
  }[];
  commonMatters: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface Article {
  slug: string;
  category: string;
  title: string;
  date: string;
  author: string;
  readingTime: string;
  heroImage: string;
  summary: string;
  content: {
    heading: string;
    paragraphs: string[];
  }[];
}

export const practiceAreasData: Record<string, PracticeArea> = {
  "artisan-pizzas": {
    slug: "artisan-pizzas",
    title: "Artisan Pizzas & Calzones",
    subtitle: "Handcrafted 48-hour fermented sourdough pizzas fired in volcanic stone ovens at 850°F with authentic Italian ingredients.",
    heroImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
    overviewDescription: "Our artisan pizza kitchen combines traditional Neapolitan dough-making techniques with modern gourmet toppings. We source whole milk Fior di Latte mozzarella, San Marzano D.O.P. tomatoes, and aromatic fresh herbs to craft every single pie to order.",
    services: [
      { icon: "Flame", title: "Wood-Fired Crusts", description: "Crisp, airy leopard-charred sourdough crust made with double zero Italian flour." },
      { icon: "Sparkles", title: "Gourmet Toppings", description: "Whole burrata balls, 24-month aged prosciutto di Parma, black truffle oils, and fresh sweet basil." },
      { icon: "ShieldCheck", title: "Dietary Options", description: "Certified cauliflower gluten-free crusts and house-made cashew vegan mozzarella." },
      { icon: "Clock", title: "Rapid Baking", description: "Baked in 90 seconds in 850°F stone ovens to retain maximum moisture and crispiness." }
    ],
    commonMatters: [
      "Truffle Burrata Margherita",
      "Spicy Pepperoni & Hot Honey",
      "Wild Mushroom & Gorgonzola",
      "Prosciutto Crudo & Arugula",
      "Four Cheese & Rosemary Garlic",
      "Mediterranean Roasted Veggie"
    ],
    faqs: [
      { question: "How long does pizza delivery take?", answer: "Our courier delivers within 25-35 minutes in temperature-controlled thermal boxes to ensure the crust stays crispy and cheese hot." },
      { question: "Do you offer gluten-free crusts?", answer: "Yes, we prepare cauliflower and rice flour gluten-free crusts on dedicated baking stones." },
      { question: "Can I customize my toppings?", answer: "Absolutely! You can choose additional cheeses, gourmet meats, vegetables, and hot honey drizzles when adding to cart." }
    ]
  },
  "gourmet-burgers": {
    slug: "gourmet-burgers",
    title: "Gourmet Smash Burgers & Sliders",
    subtitle: "100% prime Wagyu beef smash patties, toasted golden brioche buns, aged Wisconsin cheddar, and secret Crave sauce.",
    heroImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
    overviewDescription: "We take burgers seriously. Each patty is smashed ultra-crispy on searing hot cast iron to achieve maximum caramelized umami crust, then layered with melted cheddar, house pickles, and savory condiments inside butter-toasted buns.",
    services: [
      { icon: "Award", title: "Prime Wagyu Meat", description: "Freshly ground brisket and short-rib blend with zero preservatives or fillers." },
      { icon: "Flame", title: "Crispy Searing", description: "High-heat cast iron smash technique that seals in natural juices and flavor." },
      { icon: "Sparkles", title: "Handcrafted Sauces", description: "Smoky chipotle mayo, truffle garlic aioli, and tangy secret Crave relish." },
      { icon: "Clock", title: "Loaded Sides", description: "Crispy truffle parmesan fries, beer-battered onion rings, and buffalo chicken wings." }
    ],
    commonMatters: [
      "Double Smash Wagyu Cheeseburger",
      "Smoked Bacon & Truffle Burger",
      "Nashville Hot Crispy Chicken Burger",
      "Plant-Based Impossible Crave Burger",
      "BBQ Pulled Brisket Slider Trio",
      "Garlic Butter Portobello Burger"
    ],
    faqs: [
      { question: "Are your burger buns fresh?", answer: "Yes, our artisan brioche buns are baked fresh daily every morning by our partner bakery." },
      { question: "Can I get a vegetarian burger?", answer: "Yes! We serve the acclaimed Impossible Burger patty and grilled portobello mushroom burgers." },
      { question: "What sides come with the burgers?", answer: "Each burger can be paired with seasoned crispy fries, sweet potato fries, or truffle wedges." }
    ]
  },
  "asian-noodles": {
    slug: "asian-noodles",
    title: "Asian Ramen, Dim Sum & Wok Bowls",
    subtitle: "Slow-simmered 16-hour bone broths, hand-pulled noodles, steaming dim sums, and spicy wok stir-fries.",
    heroImage: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1200&auto=format&fit=crop",
    overviewDescription: "From Japanese tonkotsu and spicy miso ramen to Sichuan kung pao bowls and handmade crystal dumplings, experience the vibrant and authentic street flavors of Asia delivered piping hot.",
    services: [
      { icon: "Soup", title: "16-Hour Broths", description: "Rich, collagen-infused broths brewed slowly with aromatic ginger, scallions, and spices." },
      { icon: "Flame", title: "High-Wok Searing", description: "Smoky 'wok hei' aroma in every noodle and fried rice dish." },
      { icon: "Sparkles", title: "Fresh Hand-Rolled Dim Sum", description: "Shrimp har gow, chicken soup dumplings (xiao long bao), and vegetable gyoza." },
      { icon: "ShieldCheck", title: "Separate Packaging", description: "Ramen noodles and broths are packaged separately to keep noodles perfectly al dente." }
    ],
    commonMatters: [
      "Tokyo Black Garlic Tonkotsu Ramen",
      "Spicy Dan Dan Sichuan Noodles",
      "Thai Basil Chili Chicken with Jasmine Rice",
      "Handmade Steamed Truffle Dim Sums",
      "Pad Thai with Jumbo Prawns",
      "Crispy Korean Fried Chicken Bao Buns"
    ],
    faqs: [
      { question: "How is ramen delivered without getting soggy?", answer: "We pack the rich broth and freshly cooked noodles in dual-compartment containers. Simply pour the broth over the noodles when you're ready to eat!" },
      { question: "Can I adjust the spice level?", answer: "Yes, you can choose from Mild, Medium, Spicy, or Extra Sichuan Fire." }
    ]
  },
  "biryani-curries": {
    slug: "biryani-curries",
    title: "Royal Biryani & Slow-Simmered Curries",
    subtitle: "Dum pukht saffron infused basmati rice, tender clay-oven kebabs, and velvety tandoori gravies.",
    heroImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop",
    overviewDescription: "Savor the rich heritage of Royal Indian cuisine. Marinated meats and vegetables are sealed in heavy handis to slow-cook in their own juices, absorbing saffron, cardamom, and rose petal aromas.",
    services: [
      { icon: "Flame", title: "Dum Pukht Cooking", description: "Clay pot sealing technique that infuses deep aroma and tenderness." },
      { icon: "Award", title: "Pure Saffron & Ghee", description: "Cooked with pure Kashmiri saffron strands and farm-fresh desi ghee." },
      { icon: "Sparkles", title: "Tandoori Specialties", description: "Charcoal-grilled kebabs, tikkas, and flaky butter garlic naans." },
      { icon: "Clock", title: "Complete Feast Meals", description: "Served with fragrant mirchi salan, cooling cucumber raita, and pickled onions." }
    ],
    commonMatters: [
      "Royal Hyderabadi Dum Chicken Biryani",
      "Lucknowi Mutton Awadhi Biryani",
      "Murgh Makhani (Butter Chicken) Feast",
      "Paneer Tikka Masala with Garlic Naan",
      "Smoked Tandoori Chicken Platter",
      "Dal Makhani Slow-Cooked for 24 Hours"
    ],
    faqs: [
      { question: "Does the biryani come with sides?", answer: "Yes, every biryani order includes spiced mirchi ka salan gravy and cooling herb raita." },
      { question: "Is the food prepared fresh daily?", answer: "Yes, all gravies, naans, and biryanis are prepared freshly in small batches throughout the day." }
    ]
  },
  "healthy-salads": {
    slug: "healthy-salads",
    title: "Superfood Bowls & Crisp Green Salads",
    subtitle: "Organic seasonal greens, high-protein grain bowls, avocado power plates, and cold-pressed citrus dressings.",
    heroImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
    overviewDescription: "Fuel your body with wholesome, vibrant, nutrient-dense ingredients. Our bowls feature organic quinoa, kale, roasted seeds, fresh avocado, grilled proteins, and house-made dairy-free dressings.",
    services: [
      { icon: "Salad", title: "100% Organic Greens", description: "Washed and crisped fresh daily from local certified sustainable farms." },
      { icon: "Heart", title: "Calorie & Macro Balanced", description: "Clear nutrition breakdowns with high protein and healthy fats." },
      { icon: "Sparkles", title: "Clean Dressings", description: "Made from extra virgin olive oil, tahini, lemon juice, and apple cider vinegar with zero refined sugar." },
      { icon: "ShieldCheck", title: "Vegan & Keto Options", description: "Customizable keto, vegan, and paleo meal bowls for all fitness goals." }
    ],
    commonMatters: [
      "Avocado & Edamame Superfood Bowl",
      "Grilled Chicken & Quinoa Mediterranean Salad",
      "Roasted Sweet Potato & Kale Power Bowl",
      "Wild Smoked Salmon Poke Bowl",
      "Greek Feta & Kalamata Olive Bowl",
      "Green Detox Smoothie & Protein Shakes"
    ],
    faqs: [
      { question: "Are dressings served on the side?", answer: "Yes, all dressings are packaged in separate sealed containers so your salad stays perfectly crisp until you eat." },
      { question: "Can I customize ingredients for allergies?", answer: "Yes! You can exclude nuts, dairy, gluten, or specific ingredients during ordering." }
    ]
  },
  "desserts-gelato": {
    slug: "desserts-gelato",
    title: "Artisan Desserts, Gelato & Shakes",
    subtitle: "Warm molten chocolate lava cakes, handcrafted Italian gelato, churros, and gourmet thick shakes.",
    heroImage: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1200&auto=format&fit=crop",
    overviewDescription: "End your meal on a sweet high note. From velvety 70% dark Belgian chocolate fondants to creamy pistachio Sicilian gelato and loaded biscoff milkshakes, our pastry kitchen crafts pure indulgence.",
    services: [
      { icon: "Coffee", title: "Belgian Chocolatier", description: "Crafted with single-origin Callebaut and Valrhona chocolates." },
      { icon: "Sparkles", title: "Hand-Churned Gelato", description: "Traditional Italian slow-churn gelato with intense natural flavors and zero artificial colors." },
      { icon: "Flame", title: "Warm Fresh Pastries", description: "Oven-warmed cookies, cinnamon churros with dulce de leche, and molten cakes." },
      { icon: "Award", title: "Thick Gourmet Shakes", description: "Blended with real gelato, Belgian chocolate ganache, and Madagascar vanilla." }
    ],
    commonMatters: [
      "Molten Belgian Chocolate Lava Cake",
      "Pistachio & Sea Salt Caramel Gelato",
      "Warm Cinnamon Sugar Churros with Nutella",
      "Lotus Biscoff Crumble Milkshake",
      "New York Baked Cheesecake with Berry Compote",
      "Tiramisu Tradizionale with Espresso & Mascarpone"
    ],
    faqs: [
      { question: "Does gelato melt during delivery?", answer: "We pack all frozen desserts in specialized dry-ice insulated pouches to keep them perfectly frozen during transit." },
      { question: "Are there eggless dessert options?", answer: "Yes, our gelatos, churros, and several cakes are 100% eggless and clearly marked." }
    ]
  }
};

export const articlesData: Record<string, Article> = {
  "secret-behind-perfect-sourdough-pizza": {
    slug: "secret-behind-perfect-sourdough-pizza",
    category: "Culinary Secrets",
    title: "The Art of 48-Hour Cold Fermentation: Why Sourdough Pizza Tastes Better",
    date: "August 20, 2026",
    author: "Chef Marco Rossi",
    readingTime: "5 min read",
    heroImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
    summary: "Discover how slow fermentation breaks down complex gluten, creating a light, airy, and deeply flavorful crust with unmatched digestability.",
    content: [
      {
        heading: "The Chemistry of Slow Fermentation",
        paragraphs: [
          "Unlike commercial fast-rise yeasts that force dough to expand in two hours, natural sourdough starter relies on wild yeasts and beneficial lactobacilli bacteria.",
          "When dough is rested in temperature-controlled chillers for 48 hours, these microorganisms slowly convert starches into complex aromatic compounds, lactic acid, and carbon dioxide bubbles."
        ]
      },
      {
        heading: "Why It Feels Lighter in Your Stomach",
        paragraphs: [
          "The extended fermentation pre-digests heavy gluten proteins. This means you can indulge in wood-fired pizza without feeling bloated or sluggish afterward.",
          "Paired with imported San Marzano tomatoes grown in volcanic soil near Mount Vesuvius, each bite offers the perfect balance of crispiness, chew, and tangy sweetness."
        ]
      }
    ]
  },
  "mastering-wagyu-smash-burgers": {
    slug: "mastering-wagyu-smash-burgers",
    category: "Chef's Craft",
    title: "The Science of the Maillard Reaction in Wagyu Smash Burgers",
    date: "August 15, 2026",
    author: "Chef Liam Chen",
    readingTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
    summary: "Learn how high-heat cast iron searing locks in succulent juices while developing an irresistible caramelized crust.",
    content: [
      {
        heading: "What Makes Smash Burgers Superior?",
        paragraphs: [
          "Smashing high-grade Wagyu ground beef onto a scorching 450°F flat-top creates immediate maximum surface contact.",
          "This triggers the Maillard reaction—a chemical reaction between amino acids and reducing sugars that produces rich, savory umami flavors."
        ]
      }
    ]
  },
  "farm-to-table-freshness-promise": {
    slug: "farm-to-table-freshness-promise",
    category: "Fresh & Healthy",
    title: "From Local Organic Farms to Your Doorstep: Our 100% Fresh Ingredient Promise",
    date: "August 10, 2026",
    author: "Sarah Jenkins",
    readingTime: "4 min read",
    heroImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
    summary: "How CraveBite partners directly with local farmers and artisan producers to deliver seasonal, preservative-free meals every single day.",
    content: [
      {
        heading: "Zero Freezers, Zero Artificial Additives",
        paragraphs: [
          "We believe great food starts with pristine ingredients. All vegetables, herbs, and dairy delivered to our kitchens are harvested within 24 hours of prep.",
          "Our riders use thermal insulated smart delivery backpacks that maintain precise temperature and humidity, keeping crispy items crunchy and hot dishes steaming fresh."
        ]
      }
    ]
  }
};