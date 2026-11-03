// Testar rättningen i index.html.  Kör:  node tests/rattning.test.mjs [fil.html]
// Läser in rättningskoden direkt ur provsidan, så testet följer alltid den riktiga koden.
import { readFileSync } from "node:fs";
import vm from "node:vm";

function laddaRattning(html) {
  const start = html.indexOf("const QUESTIONS");
  const slut = html.indexOf("/* ---------- Tillstånd");
  if (start < 0 || slut < 0) throw new Error("Hittar inte rättningskoden i filen");
  return vm.runInNewContext(html.slice(start, slut) + "\n;({ QUESTIONS, stepMatches })", {});
}

const fil = process.argv[2] || new URL("../index.html", import.meta.url);
const { QUESTIONS, stepMatches } = laddaRattning(readFileSync(fil, "utf8"));

// [fråga, steg, elevsvar]  (fråga och steg räknas från 0)
const SKA_GE_POANG = [
  [0, 0, "Atomen har en kerna med protner och neutorner"],
  [0, 2, "Elektorner finns runt kärnan"],
  [0, 3, "Lika mnga protoner som elektroner"],
  [0, 3, "likamånga protoner och elektroner"],
  [1, 0, "Han sköt partiklar mot en tunn foile"],
  [1, 3, "några studsde tilbaka"],
  [3, 0, "kärnan är intsabil"],
  [3, 1, "Alpha strålning är heliumkärnor"],
  [3, 2, "Betta strålning"],
  [3, 3, "Gama strålning är elektromagnetisk"],
  [4, 1, "De sönderfaller slupmässigt"],
  [5, 3, "halvringtiden är lång"],
  [6, 2, "Det blir fision"],
  [6, 3, "en kejdereaktion startar"],
  [6, 6, "Det blir elektrisitet"],
  [9, 0, "lätta kärnor som vete"],
  [11, 2, "skelletet absorberar mer"],
  [12, 1, "Ljuset består av fottoner"],
  [13, 2, "De kallas isotåper"],
  [14, 1, "J.J. Tompson hittade elecktronen"],
  [14, 3, "Rutherfrod visade att atomen har en kärna"],
  [14, 5, "Bekkerell upptäckte radioaktivitet"],
  // Rätt stavat ska förstås fortfarande fungera
  [0, 0, "Kärnan består av protoner och neutroner"],
  [9, 0, "Väte är en lätt atomkärna"],
];

const SKA_INTE_GE_POANG = [
  [3, 1, "Alla strålar är farliga"],          // alla ≠ alfa
  [9, 0, "Vatten kokar"],                     // vatten ≠ väte
  [9, 0, "vattnet blir varmt"],
  [0, 4, "Det finns massor av elektroner"],   // massor ≠ massa
  [0, 0, "Atomen har elektroner"],
  [14, 3, "Bohr visade kärnan"],
  [4, 1, "De sönderfaller långsamt"],
  [13, 2, "Det är isolering"],
  [12, 4, "Det blir strålning"],
  [6, 0, "Det är bara energi"],
];

let fel = 0;
const kolla = (lista, väntat) => lista.forEach(([q, s, svar]) => {
  const fick = stepMatches(svar, QUESTIONS[q].s[s]);
  if (fick !== väntat) {
    fel++;
    console.log(`  ✗ Fråga ${q + 1}, steg ${s + 1}: "${svar}" ${väntat ? "borde ge poäng" : "borde INTE ge poäng"}`);
  }
});

console.log("Felstavade men rätta svar:");
kolla(SKA_GE_POANG, true);
console.log("Fel svar:");
kolla(SKA_INTE_GE_POANG, false);

const totalt = SKA_GE_POANG.length + SKA_INTE_GE_POANG.length;
console.log(`\n${totalt - fel} av ${totalt} fall rättas som väntat.`);
process.exit(fel ? 1 : 0);
