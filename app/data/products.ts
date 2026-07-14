export type Product = {
  slug: string;
  name: string;
  price: number;
  images: string[];
  category?: string;
  description?: string;
};

export const products: Product[] = [
  {
    slug: "Chem-Trail",
    name: "Chem-Trail",
    price: 60,
    images: [
      "/Chem-Trail.PNG",
      "/Chem-Trail-close.PNG",
    ],
  },

  {
    slug: "Farsh",
    name: "Farsh",
    price: 60,
    images: [
      "/Farsh.PNG",
      "/Farsh-close.PNG",
    ],
  },

  {
    slug: "Leochi",
    name: "Leochi Classic",
    price: 60,
    images: [
      "/Leochi.PNG",
      "/Leochi-close.PNG",
    ],
  },
];