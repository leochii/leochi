export type Product = {
  slug: string;
  name: string;
  price: number;
  variants: Array<{
    color: "White" | "Black";
    images: string[];
  }>;
  category?: string;
  description?: string;
};

export const products: Product[] = [
  {
    slug: "shahnameh",
    name: "Shahnameh Tee",
    price: 60,
    variants: [
      {
        color: "White",
        images: [
          "/Shahnameh-front-white-male.jpg",
          "/Shahnameh-back-white-male.jpg",
        ],
      },
      {
        color: "Black",
        images: [
          "/Shahnameh-front-black-male.jpg",
          "/Shahnameh-back-black-male.jpg",
        ],
      },
    ],
    category: "Summer 2026",
    description: "Heritage graphic tee available in black and white with curated lifestyle imagery.",
  },
  {
    slug: "shiraz",
    name: "Shiraz Tee",
    price: 60,
    variants: [
      {
        color: "White",
        images: [
          "/Shiraz-white-female-crosswalk.jpg",
          "/Shiraz-white-editorial-duo.jpg",
          "/Shiraz-white-female-flower.jpg",
        ],
      },
      {
        color: "Black",
        images: [
          "/Shiraz-black-male-cafe-front.jpg",
          "/Shiraz-black-male-cafe-back.jpg",
          "/Shiraz-black-female-front.PNG",
          "/Shiraz-black-female-back.jpg",
        ],
      },
    ],
    category: "Summer 2026",
    description: "Persian-inspired statement tee offered in black and white with male and female lifestyle shots.",
  },
  {
    slug: "isfahan",
    name: "Isfahan Tee",
    price: 60,
    variants: [
      {
        color: "White",
        images: [
          "/Isfahan-white-front-male-street.jpg",
          "/Isfahan-white-back-male-street.jpg",
        ],
      },
      {
        color: "Black",
        images: [],
      },
    ],
    category: "Summer 2026",
    description: "Minimal graphic tee in black and white variants with street-style lifestyle frames.",
  },
];