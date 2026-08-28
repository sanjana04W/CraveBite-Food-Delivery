export interface FoodArticle {
  slug: string;
  category: string;
  title: string;
  date: string;
  author: string;
  authorRole: string;
  readingTime: string;
  heroImage: string;
  summary: string;
  content: {
    heading: string;
    paragraphs: string[];
  }[];
}

export const foodArticlesData: Record<string, FoodArticle> = {
  "secret-behind-perfect-sourdough-pizza": {
    slug: "secret-behind-perfect-sourdough-pizza",
    category: "Culinary Secrets",
    title: "The Art of 48-Hour Cold Fermentation: Why Sourdough Pizza Tastes Better",
    date: "August 20, 2026",
    author: "Chef Marco Rossi",
    authorRole: "Head Pizzaiolo",
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
      },
      {
        heading: "Baking in Wood-Fired Ovens at 850°F",
        paragraphs: [
          "Our custom stone ovens bake each handcrafted pie in just 90 seconds. This intense heat traps internal moisture while blister-charring the leopard-spotted cornicione (crust edge)."
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
    authorRole: "Executive Burger Specialist",
    readingTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
    summary: "Learn how high-heat cast iron searing locks in succulent juices while developing an irresistible caramelized crust.",
    content: [
      {
        heading: "What Makes Smash Burgers Superior?",
        paragraphs: [
          "Smashing high-grade Wagyu ground beef onto a scorching 450°F flat-top creates immediate maximum surface contact.",
          "This triggers the Maillard reaction—a chemical reaction between amino acids and reducing sugars that produces rich, savory umami flavors that cannot be achieved with standard grilling."
        ]
      },
      {
        heading: "The Golden Ratio: Fat to Meat",
        paragraphs: [
          "We grind brisket, short rib, and chuck in an 80/20 ratio. Wagyu marbling ensures the burger stays extraordinarily juicy even when smashed paper-thin at the edges."
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
    authorRole: "Head of Sustainable Sourcing",
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
