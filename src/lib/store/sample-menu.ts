import type { Menu } from "@/lib/types";

/**
 * The sample menu that ships with the project. It seeds the local JSON store on
 * first run and the Postgres database via `npm run db:seed`. Prices are in baisa.
 * Bilingual (English base + Arabic) to demonstrate the RTL menu.
 *
 * Replace these with the restaurant's own transparent PNGs and copy.
 */
export const sampleMenu: Menu = [
  {
    id: "cat-appetisers",
    name: "Appetisers",
    nameAr: "المقبّلات",
    kicker: null,
    position: 0,
    items: [
      {
        id: "item-burrata",
        name: "Burrata & Heirloom Tomato",
        nameAr: "بوراتا وطماطم هيرلوم",
        description:
          "Creamy Puglian burrata, sun-ripened heirloom tomatoes, basil oil, and a whisper of aged balsamic.",
        descriptionAr:
          "جبن بوراتا كريمي من بوليا، طماطم هيرلوم ناضجة، زيت الريحان، ولمسة من الخل البلسمي المعتّق.",
        priceBaisa: 4900,
        imageUrl: "/sample/item-burrata.svg",
        position: 0,
      },
      {
        id: "item-scallops",
        name: "Seared Scallops",
        nameAr: "إسكالوب محمّر",
        description:
          "Hand-dived scallops, cauliflower velouté, brown butter, and toasted hazelnut.",
        descriptionAr:
          "إسكالوب مصطاد يدويًا، كريمة القرنبيط، زبدة بنّية، وبندق محمّص.",
        priceBaisa: 6500,
        imageUrl: "/sample/item-scallops.svg",
        position: 1,
      },
      {
        id: "item-beetroot",
        name: "Roasted Beetroot",
        nameAr: "شمندر محمّص",
        description:
          "Candied golden and crimson beets, whipped goat cheese, orange, and pistachio dukkah.",
        descriptionAr:
          "شمندر ذهبي وأحمر مكرمل، جبن ماعز مخفوق، برتقال، ودُقّة الفستق.",
        priceBaisa: 3800,
        imageUrl: "/sample/item-beetroot.svg",
        position: 2,
      },
    ],
  },
  {
    id: "cat-main",
    name: "Main Dishes",
    nameAr: "الأطباق الرئيسية",
    kicker: null,
    position: 1,
    items: [
      {
        id: "item-ribeye",
        name: "Dry-Aged Ribeye",
        nameAr: "ريب آي معتّق",
        description:
          "42-day dry-aged ribeye, bone marrow butter, charred shallot, and triple-cooked chips.",
        descriptionAr:
          "ريب آي معتّق ٤٢ يومًا، زبدة نخاع العظم، بصل مشوي، وبطاطس مقلية ثلاث مرّات.",
        priceBaisa: 18500,
        imageUrl: "/sample/item-ribeye.svg",
        position: 0,
      },
      {
        id: "item-seabass",
        name: "Wild Sea Bass",
        nameAr: "قاروص بري",
        description:
          "Line-caught sea bass, saffron mussel broth, fennel, and confit fingerling potatoes.",
        descriptionAr:
          "سمك قاروص مصطاد بالصنّارة، مرق بلح البحر بالزعفران، شمر، وبطاطس كونفي.",
        priceBaisa: 14000,
        imageUrl: "/sample/item-seabass.svg",
        position: 1,
      },
      {
        id: "item-risotto",
        name: "Wild Mushroom Risotto",
        nameAr: "ريزوتو الفطر البري",
        description:
          "Carnaroli rice, wild forest mushrooms, aged parmesan, truffle, and a soft herb oil.",
        descriptionAr:
          "أرز كارنارولي، فطر الغابة البري، جبن بارميزان معتّق، كمأة، وزيت أعشاب.",
        priceBaisa: 9500,
        imageUrl: "/sample/item-risotto.svg",
        position: 2,
      },
    ],
  },
  {
    id: "cat-rice",
    name: "Rice Meals",
    nameAr: "أطباق الأرز",
    kicker: null,
    position: 2,
    items: [
      {
        id: "item-biryani",
        name: "Lamb Biryani",
        nameAr: "برياني اللحم",
        description:
          "Fragrant basmati layered with slow-braised lamb shank, saffron, fried onion, and mint yoghurt.",
        descriptionAr:
          "أرز بسمتي معطّر بطبقات من لحم الضأن المطهو ببطء، زعفران، بصل مقلي، ولبن بالنعناع.",
        priceBaisa: 8900,
        imageUrl: "/sample/item-biryani.svg",
        position: 0,
      },
      {
        id: "item-machboos",
        name: "Prawn Machboos",
        nameAr: "مجبوس الروبيان",
        description:
          "Omani-spiced rice with tiger prawns, dried lime, tomato, and a warm baharat blend.",
        descriptionAr:
          "أرز بالتوابل العُمانية مع روبيان النمر، لومي، طماطم، وخلطة بهارات دافئة.",
        priceBaisa: 10500,
        imageUrl: "/sample/item-machboos.svg",
        position: 1,
      },
    ],
  },
  {
    id: "cat-hot-drinks",
    name: "Hot Drinks",
    nameAr: "المشروبات الساخنة",
    kicker: null,
    position: 3,
    items: [
      {
        id: "item-cardamom-coffee",
        name: "Omani Cardamom Coffee",
        nameAr: "قهوة عُمانية بالهيل",
        description:
          "Lightly roasted Arabica infused with green cardamom, served with a date on the side.",
        descriptionAr:
          "بُن عربي محمّص قليلًا منقوع بالهيل الأخضر، يُقدَّم مع تمرة.",
        priceBaisa: 2200,
        imageUrl: "/sample/item-cardamom-coffee.svg",
        position: 0,
      },
      {
        id: "item-saffron-latte",
        name: "Saffron & Rose Latte",
        nameAr: "لاتيه الزعفران والورد",
        description:
          "Steamed milk, a thread of saffron, rose water, and raw honey. Gentle and aromatic.",
        descriptionAr:
          "حليب مبخّر، خيط من الزعفران، ماء الورد، وعسل خام. لطيف وعطري.",
        priceBaisa: 2800,
        imageUrl: "/sample/item-saffron-latte.svg",
        position: 1,
      },
      {
        id: "item-mint-tea",
        name: "Moroccan Mint Tea",
        nameAr: "شاي مغربي بالنعناع",
        description:
          "Gunpowder green tea steeped with fresh spearmint, poured tall and sweet.",
        descriptionAr:
          "شاي أخضر بارود منقوع بالنعناع الطازج، يُسكب عاليًا ومحلّى.",
        priceBaisa: 1800,
        imageUrl: "/sample/item-mint-tea.svg",
        position: 2,
      },
    ],
  },
];

/** A deep clone so callers can mutate freely without touching the template. */
export function cloneSampleMenu(): Menu {
  return JSON.parse(JSON.stringify(sampleMenu));
}
