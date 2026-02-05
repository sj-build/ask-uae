import type {
  WelfareItem,
  WomenStatusItem,
  WomenRightsItem,
  FoodCultureItem,
  LocalFoodItem,
  ClimateSeasonData,
  ClimateImpactItem,
} from "./welfare-women-food";

// Welfare Section
export const welfareData: readonly WelfareItem[] = [
  {
    category: "healthcare",
    icon: "🏥",
    title: "Healthcare System",
    items: [
      "World-class institutions: Cleveland Clinic Abu Dhabi, Johns Hopkins Medicine",
      "Integrated healthcare system centered on DHA (Dubai Health Authority)",
      "Emiratis: Free medical services at government hospitals",
      "Expats: Mandatory employer-provided health insurance (since 2014)",
      "Medical tourism hub: Target of 500,000 medical tourists by 2025",
    ],
    note: "Expat medical costs are high - ensure adequate insurance coverage",
  },
  {
    category: "education",
    icon: "🎓",
    title: "Education System",
    items: [
      "Education spending as % of GDP among world's highest",
      "Prestigious university branches: NYU Abu Dhabi, Sorbonne Abu Dhabi",
      "200+ international schools (British, American, IB curricula)",
      "Emiratis: Free from kindergarten to university, overseas study scholarships",
      "Expats: Tuition $10,000-$30,000+ annually (varies by school)",
    ],
    note: "KHDA (Knowledge & Human Development Authority) oversees school quality",
  },
  {
    category: "pension",
    icon: "💰",
    title: "Pension/Social Security",
    items: [
      "Emiratis only: GPSSA (General Pension and Social Security Authority)",
      "Retirement: Up to 100% of salary for 20 years of service",
      "Unemployment benefits: Emiratis only (up to 3 months)",
      "Marriage grants, housing support, free land (Emiratis only)",
    ],
    note: "Expats have no social security benefits. Only End of Service Gratuity applies",
  },
  {
    category: "expat",
    icon: "🌍",
    title: "Expat Welfare Reality",
    items: [
      "End of Service Gratuity: 21-30 days salary per year of service",
      "Health insurance: Employer-mandated (family coverage negotiable)",
      "Housing allowance: Varies by company (10-20% of salary or separate)",
      "Children's education: Only some companies support (negotiate)",
      "Return flights: Annual round-trip to home country (common)",
    ],
    note: "Benefits largely depend on employer. Check contract details carefully",
  },
] as const;

// Women Section
export const womenStatusData: readonly WomenStatusItem[] = [
  {
    metric: "Parliament Participation",
    value: "50%",
    description:
      "Female representation in FNC (Federal National Council). Highest in Middle East",
    icon: "🏛️",
  },
  {
    metric: "Economic Participation",
    value: "57%",
    description:
      "Emirati women labor force participation as of 2023. Highest in GCC",
    icon: "💼",
  },
  {
    metric: "Senior Management",
    value: "30%+",
    description:
      "Leadership positions in government and state-owned enterprises. Increasing trend",
    icon: "👩‍💼",
  },
  {
    metric: "University Graduation",
    value: "70%",
    description: "Percentage of women among UAE university graduates",
    icon: "🎓",
  },
] as const;

export const womenRightsData: readonly WomenRightsItem[] = [
  {
    topic: "Driving",
    description: "No restrictions. Women free to drive",
    comparedToRegion: "Saudi Arabia only allowed in 2018",
  },
  {
    topic: "Travel",
    description:
      "No male guardian consent required. Independent travel allowed",
    comparedToRegion: "Some GCC countries still have restrictions",
  },
  {
    topic: "Dress Code",
    description:
      "Foreign women free to choose. Only mosques/government buildings require modest attire",
    comparedToRegion: "Much more liberal than Saudi Arabia/Iran",
  },
  {
    topic: "Employment",
    description: "All sectors open. Including military, police, aviation",
    comparedToRegion: "Some GCC restrict certain professions",
  },
  {
    topic: "Property Rights",
    description: "Equal property ownership and inheritance rights",
    comparedToRegion: "Clearly guaranteed by law",
  },
] as const;

export const womenCultureTips: readonly string[] = [
  "Business meetings: Meet female colleagues in public places recommended",
  "Handshake: Only shake hands with Emirati women if they initiate",
  "Eye contact: Avoid prolonged eye contact with Emirati women",
  "Photography: Always ask permission before photographing local women",
  "Ramadan: Refrain from eating/drinking in public, dress more conservatively",
] as const;

// Food Section
export const foodCultureData: readonly FoodCultureItem[] = [
  {
    category: "halal",
    icon: "🍖",
    title: "Halal Food Culture",
    points: [
      "Pork and pork by-products strictly prohibited",
      "Halal slaughter: Islamic method certification required",
      "No cooking with alcohol",
      "Imported food must have halal certification (ESMA regulated)",
      "Korean ramyeon/snacks may contain non-halal ingredients",
    ],
  },
  {
    category: "ramadan",
    icon: "🌙",
    title: "Ramadan Period",
    points: [
      "Fasting (Sawm) from sunrise to sunset",
      "Public eating/drinking prohibited (including expats)",
      "Iftar (evening fast-breaking): Key business dining opportunity",
      "Suhoor (pre-dawn meal): Last meal before fasting",
      "Alcohol more restricted during Ramadan (hotel lounges limited)",
    ],
  },
  {
    category: "multicultural",
    icon: "🌍",
    title: "Multicultural Cuisine",
    points: [
      "Diverse cuisine reflecting 200+ nationalities",
      "Indian/Pakistani food: Most abundant (reflects population)",
      "Lebanese/Turkish food: Representative Middle Eastern cuisine",
      "Korean restaurants: Concentrated in Dubai Deira area (50+)",
      "Fine dining: Many celebrity chef restaurants (Michelin stars)",
    ],
  },
  {
    category: "alcohol",
    icon: "🍷",
    title: "Alcohol Regulations",
    points: [
      "Muslims prohibited from drinking (expats allowed)",
      "Alcohol only at hotels and licensed restaurants",
      "Purchase requires liquor license (21+ age)",
      "Public drinking = illegal (severe penalties)",
      "Sharjah emirate is completely dry (no liquor licenses)",
    ],
  },
] as const;

export const localFoods: readonly LocalFoodItem[] = [
  {
    name: "Machboos",
    arabicName: "Machboos",
    description: "Spiced rice with lamb/chicken. UAE national dish",
    mustTry: true,
  },
  {
    name: "Harees",
    arabicName: "Harees",
    description: "Crushed wheat and meat porridge. Ramadan essential",
    mustTry: true,
  },
  {
    name: "Luqaimat",
    arabicName: "Luqaimat",
    description: "Honey syrup dumplings. Traditional dessert",
    mustTry: true,
  },
  {
    name: "Gahwa",
    arabicName: "Gahwa",
    description: "Arabic coffee with cardamom. Majlis staple",
    mustTry: true,
  },
  {
    name: "Ouzi",
    arabicName: "Ouzi",
    description: "Whole roasted lamb with rice. Festive dish",
    mustTry: false,
  },
  {
    name: "Thareed",
    arabicName: "Thareed",
    description: "Bread and vegetable stew. Ramadan tradition",
    mustTry: false,
  },
] as const;

export const foodBusinessTips: readonly string[] = [
  "Business dinner: Follow host's menu recommendations (never order pork/alcohol)",
  "Use right hand: Left hand is taboo when passing food",
  "Iftar invitation: Best networking opportunity during Ramadan. Always attend",
  "Tipping: 10-15% typical. Check if service charge included at upscale venues",
  "Pace of meal: Take time to enjoy conversation. Rushing is impolite",
] as const;

// Climate Section
export const climateData: readonly ClimateSeasonData[] = [
  {
    season: "Summer",
    months: "Jun-Sep",
    temperature: "40-50°C",
    humidity: "80-90%",
    description:
      "Extreme heat. Outdoor activities nearly impossible. Indoor AC essential",
    icon: "🔥",
  },
  {
    season: "Autumn",
    months: "Oct-Nov",
    temperature: "25-35°C",
    humidity: "50-60%",
    description: "Gradually cooling. Outdoor activities become possible",
    icon: "🍂",
  },
  {
    season: "Winter",
    months: "Dec-Feb",
    temperature: "15-25°C",
    humidity: "40-50%",
    description: "Optimal weather. Business season, peak tourism",
    icon: "❄️",
  },
  {
    season: "Spring",
    months: "Mar-May",
    temperature: "25-40°C",
    humidity: "40-60%",
    description: "Rising temperatures. Watch for sandstorms (Mar-Apr)",
    icon: "🌸",
  },
] as const;

export const climateBusinessImpact: readonly ClimateImpactItem[] = [
  {
    aspect: "Business Season",
    impact:
      "October-April is peak business season. Major exhibitions/conferences concentrated",
    tip: "Plan important meetings/events during winter season",
  },
  {
    aspect: "Summer Exodus",
    impact:
      "June-August: Emiratis and expats take overseas vacations. Decision-making delayed",
    tip: "Complete important contracts before summer",
  },
  {
    aspect: "Ramadan",
    impact:
      "Reduced working hours (typically 6 hours). Government agencies particularly slow",
    tip: "Avoid major deals during Ramadan",
  },
  {
    aspect: "Friday",
    impact: "Weekend (Fri-Sat). Friday prayer time: no business",
    tip: "Avoid Friday afternoon meetings",
  },
  {
    aspect: "Daylight Hours",
    impact:
      "Summer: sunrise 5:30, sunset 19:00. Winter: sunrise 7:00, sunset 17:30",
    tip: "Schedule outdoor meetings for early morning or evening",
  },
] as const;

export const climateWarnings: readonly string[] = [
  "Summer vehicle interiors can exceed 70°C. Never leave children/pets inside",
  "Dehydration risk: Drink 3-4 liters of water daily",
  "Sunscreen/sunglasses essential. UV index extremely high",
  "Outdoor construction: Work banned 12:30-15:00 (legal requirement)",
  "Sandstorms drastically reduce visibility. Avoid driving",
] as const;
