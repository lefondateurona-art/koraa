import { redirect } from "next/navigation";

// The bottom-nav "Boutique" entry maps to /discover (the prototype's
// discover view). This bare /shop route just forwards there; individual
// shops live at /shop/[shopId].
export default function ShopIndex() {
  redirect("/discover");
}
