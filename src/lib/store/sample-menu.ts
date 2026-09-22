import type { Menu } from "@/lib/types";

/**
 * The sample menu that ships with the project. It seeds the local JSON store on
 * first run and the Postgres database via `npm run db:seed`. Prices are in baisa.
 *
 * Dish art uses transparent-PNG-style plating imagery. Replace these with the
 * restaurant's own transparent PNGs from the admin panel.
 */
export const sampleMenu: Menu = [
  {
    id: "cat-appetisers",
    name: "Appetisers",
    kicker: "To begin",
    position: 0,
    items: [
      {
        id: "item-burrata",
        name: "Burrata & Heirloom Tomato",
        description:
          "Creamy Puglian burrata, sun-ripened heirloom tomatoes, basil oil, and a whisper of aged balsamic.",
        priceBaisa: 4900,
        imageUrl:
          "/sample/item-burrata.svg",
        position: 0,
      },
      {
        id: "item-scallops",
        name: "Seared Scallops",
        description:
          "Hand-dived scallops, cauliflower velouté, brown butter, and toasted hazelnut.",
        priceBaisa: 6500,
        imageUrl:
          "/sample/item-scallops.svg",
        position: 1,
      },
      {
        id: "item-beetroot",
        name: "Roasted Beetroot",
        description:
          "Candied golden and crimson beets, whipped goat cheese, orange, and pistachio dukkah.",
        priceBaisa: 3800,
        imageUrl:
          "/sample/item-beetroot.svg",
        position: 2,
      },
    ],
  },
  {
    id: "cat-main",
    name: "Main Dishes",
    kicker: "The heart of it",
    position: 1,
    items: [
      {
        id: "item-ribeye",
        name: "Dry-Aged Ribeye",
        description:
          "42-day dry-aged ribeye, bone marrow butter, charred shallot, and triple-cooked chips.",
        priceBaisa: 18500,
        imageUrl:
          "/sample/item-ribeye.svg",
        position: 0,
      },
      {
        id: "item-seabass",
        name: "Wild Sea Bass",
        description:
          "Line-caught sea bass, saffron mussel broth, fennel, and confit fingerling potatoes.",
        priceBaisa: 14000,
        imageUrl:
          "/sample/item-seabass.svg",
        position: 1,
      },
      {
        id: "item-risotto",
        name: "Wild Mushroom Risotto",
        description:
          "Carnaroli rice, wild forest mushrooms, aged parmesan, truffle, and a soft herb oil.",
        priceBaisa: 9500,
        imageUrl:
          "/sample/item-risotto.svg",
        position: 2,
      },
    ],
  },
  {
    id: "cat-rice",
    name: "Rice Meals",
    kicker: "Slow & fragrant",
    position: 2,
    items: [
      {
        id: "item-biryani",
        name: "Lamb Biryani",
        description:
          "Fragrant basmati layered with slow-braised lamb shank, saffron, fried onion, and mint yoghurt.",
        priceBaisa: 8900,
        imageUrl:
          "/sample/item-biryani.svg",
        position: 0,
      },
      {
        id: "item-machboos",
        name: "Prawn Machboos",
        description:
          "Omani-spiced rice with tiger prawns, dried lime, tomato, and a warm baharat blend.",
        priceBaisa: 10500,
        imageUrl:
          "/sample/item-machboos.svg",
        position: 1,
      },
    ],
  },
  {
    id: "cat-hot-drinks",
    name: "Hot Drinks",
    kicker: "To linger",
    position: 3,
    items: [
      {
        id: "item-cardamom-coffee",
        name: "Omani Cardamom Coffee",
        description:
          "Lightly roasted Arabica infused with green cardamom, served with a date on the side.",
        priceBaisa: 2200,
        imageUrl:
          "/sample/item-cardamom-coffee.svg",
        position: 0,
      },
      {
        id: "item-saffron-latte",
        name: "Saffron & Rose Latte",
        description:
          "Steamed milk, a thread of saffron, rose water, and raw honey. Gentle and aromatic.",
        priceBaisa: 2800,
        imageUrl:
          "/sample/item-saffron-latte.svg",
        position: 1,
      },
      {
        id: "item-mint-tea",
        name: "Moroccan Mint Tea",
        description:
          "Gunpowder green tea steeped with fresh spearmint, poured tall and sweet.",
        priceBaisa: 1800,
        imageUrl:
          "/sample/item-mint-tea.svg",
        position: 2,
      },
    ],
  },
];

/** A deep clone so callers can mutate freely without touching the template. */
export function cloneSampleMenu(): Menu {
  return JSON.parse(JSON.stringify(sampleMenu));
}
