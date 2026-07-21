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
    slug: "shahnameh-tee",
    name: "Shahnameh Tee",
    price: 60,
    variants: [
      {
        color: "White",
        images: [
          "/Shahnameh-front-white-male.jpg",
          "/Shahnameh-back-white-male.jpg",
          "/shahnameh-front-white-female-park.jpg",
          "/shahnameh-back-white-female-park.jpg",
        ],
      },
      {
        color: "Black",
        images: [
          "/Shahnameh-front-black-male.jpg",
          "/Shahnameh-back-black-male.jpg",
          "/Shahnameh-front-black-male.jpg",
          "/Shahnameh-back-black-male.jpg",
        ],
      },
    ],
    category: "Summer 2026",
    description: "Heritage graphic tee available in black and white with curated lifestyle imagery.",
  },
  {
    slug: "shiraz-tee",
    name: "Shiraz Tee",
    price: 60,
    variants: [
      {
        color: "White",
        images: [
          "/Shiraz-white-editorial-duo.jpg",
          "/Shiraz-white-femail-flower.jpg",
          "/shiraz-white-female-crosswalk.jpg",
          "/Shiraz-white-editorial-duo.jpg",
        ],
      },
      {
        color: "Black",
        images: [
          "/Shiraz-black-male-cafe-front.jpg",
          "/Shiraz-black-male-cafe-back.jpg",
          "/Shiraz-black-female-front.PNG",
          "/shiraz-black-femaile-back.jpg",
        ],
      },
    ],
    category: "Summer 2026",
    description: "Persian-inspired statement tee offered in black and white with male and female lifestyle shots.",
  },
  {
    slug: "isfahan-tee",
    name: "Isfahan Tee",
    price: 60,
    variants: [
      {
        color: "White",
        images: [
          "/Isafahn-white-front-male-street.jpg",
          "/isfahan-white-back-male-street.jpg",
          "/Isafahn-white-front-male-street.jpg",
          "/isfahan-white-back-male-street.jpg",
        ],
      },
      {
        color: "Black",
        images: [
          "/Isafahn-white-front-male-street.jpg",
          "/isfahan-white-back-male-street.jpg",
          "/Isafahn-white-front-male-street.jpg",
          "/isfahan-white-back-male-street.jpg",
        ],
      },
    ],
    category: "Summer 2026",
    description: "Minimal graphic tee in black and white variants with street-style lifestyle frames.",
  },
];