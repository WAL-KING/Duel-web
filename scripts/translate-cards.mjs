import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
const FILE = "public/data/cards.json", BAK = "public/data/cards.en.json";
if (!existsSync(FILE)) { console.error("cards.json introuvable : lance d'abord npm run data"); process.exit(1); }
if (!existsSync(BAK)) copyFileSync(FILE, BAK);
const cards = JSON.parse(readFileSync(BAK, "utf8"));
console.log("Téléchargement des cartes françaises...");
const r = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?language=fr");
if (!r.ok) { console.error("Erreur API :", r.status); process.exit(1); }
const { data } = await r.json();
const fr = new Map(data.map((c) => [c.id, c]));
let n = 0;
for (const c of cards) {
  const t = fr.get(c[0]);
  if (t && t.name && t.desc) { c[10] = t.name; c[11] = t.desc; n++; }
}
writeFileSync(FILE, JSON.stringify(cards));
console.log(`Terminé : ${n} cartes traduites sur ${cards.length}.`);
