// Frågor och facit för sistaprov. Används både av provsidan (index.html) och av rättningsservern (server/server.mjs).
// f = facitsteg. k = nyckelordsgrupper för reservrättningen om rättningsservern inte går att nå:
// ett svar innehåller steget om det har minst ett ord ur VARJE grupp (utan å/ä/ö, ordbörjan, ett stavfel tillåts).
const QUESTIONS = [
  { t: "Hur är en atom uppbyggd?", s: [
    { f: "Atomen har en kärna, som består av protoner och neutroner.", k: [["karn"], ["proton", "neutron"]] },
    { f: "Protonerna är positiva. Neutronerna saknar laddning.", k: [["proton", "neutron"], ["positiv", "plus", "laddad", "laddning", "oladdad", "neutral"]] },
    { f: "Elektronerna finns runt kärnan och är negativa.", k: [["elektron"], ["negativ", "runt", "kring", "utanfor", "skal"]] },
    { f: "En atom är normalt neutral: lika många protoner som elektroner.", k: [["neutral", "lika manga", "tar ut varandra", "oladdad"]] },
    { f: "Nästan all massa finns i kärnan.", k: [["massa", "vager", "tung", "vikt"]] },
  ]},
  { t: "Hur upptäckte Rutherford atomkärnan?", s: [
    { f: "Rutherford sköt positivt laddade partiklar mot en tunn guldfolie.", k: [["guld", "folie"]] },
    { f: "De flesta partiklarna gick rakt igenom – atomen är mest tomrum.", k: [["igenom", "tomrum", "tom ", "rakt genom"]] },
    { f: "Några partiklar ändrade riktning.", k: [["riktning", "boj", "avlank", "andrade", "avvek", "sned"]] },
    { f: "Ett fåtal partiklar studsade tillbaka.", k: [["studs", "tillbaka", "reflekt", "rekyl"]] },
    { f: "Slutsats: atomen har en liten, tät och positivt laddad kärna.", k: [["karn"]] },
  ]},
  { t: "Hur fungerar elektromagnetisk strålning från atomer?", s: [
    { f: "Atomen får energi, till exempel genom uppvärmning.", k: [["atom", "amne"], ["energi", "varm", "hett", "upphett"]] },
    { f: "En elektron tar upp energin och hamnar i ett tillstånd med högre energi.", k: [["elektron"], ["hogre", "upp", "exciter", "hoppar"]] },
    { f: "Elektronen återgår till ett tillstånd med lägre energi.", k: [["ater", "tillbaka", "lagre", "faller", "ner", "ned"]] },
    { f: "Energi frigörs och sänds ut som elektromagnetisk strålning.", k: [["stral", "ljus", "foton", "frigor", "sands ut", "sander ut", "avger"]] },
    { f: "Strålningens energi beror på energiskillnaden (t.ex. synligt ljus eller röntgen).", k: [["skillnad", "olika", "synligt", "rontgen", "vaglangd", "farg", "beror"]] },
  ]},
  { t: "Hur fungerar radioaktiv strålning?", s: [
    { f: "Atomkärnan är instabil.", k: [["instabil", "ostabil", "inte stabil"]] },
    { f: "Alfastrålning: två protoner och två neutroner.", k: [["alfa"]] },
    { f: "Betastrålning: en neutron blir en proton och en elektron som lämnar kärnan.", k: [["beta"]] },
    { f: "Gammastrålning: energirik elektromagnetisk strålning.", k: [["gamma"]] },
    { f: "Kärnan förändras – ett nytt grundämne kan bildas.", k: [["grundamne", "forandras", "andras", "nytt amne", "annat amne", "omvandlas"]] },
    { f: "Olika genomträngningsförmåga: alfa stoppas lätt, gamma tränger igenom mest.", k: [["genomtrang", "tranger", "stoppa", "rackvidd", "papper", "bly", "betong"]] },
  ]},
  { t: "Hur fungerar halveringstid?", s: [
    { f: "Ett radioaktivt ämne innehåller instabila atomkärnor.", k: [["instabil", "radioaktiv", "ostabil"]] },
    { f: "Kärnorna sönderfaller slumpmässigt.", k: [["slump"]] },
    { f: "Halveringstiden är tiden det tar för hälften av kärnorna att sönderfalla.", k: [["tid"], ["halft", "halva", "halv"]] },
    { f: "Efter en halveringstid återstår hälften (1 000 → 500).", k: [["500", "kvar", "aterstar", "aterstod"]] },
    { f: "Efter varje ny halveringstid halveras det som är kvar (→ 250 → 125).", k: [["250", "125", "varje", "igen", "ytterligare", "sedan", "fortsatter"]] },
  ]},
  { t: "Hur fungerar kol-14-metoden?", s: [
    { f: "Levande organismer tar upp kol, så andelen kol-14 är stabil.", k: [["lev"], ["kol", "c 14", "tar upp", "andas", "ater", "fotosyntes"]] },
    { f: "Organismen dör och slutar ta upp kol.", k: [["dor", "dod", "dott"]] },
    { f: "Kol-14 sönderfaller och minskar (blir kväve-14).", k: [["sonderf", "minsk", "avtar", "kvave", "forsvinn"]] },
    { f: "Kol-14 har en halveringstid på cirka 5 730 år.", k: [["5730", "5700", "halveringstid"]] },
    { f: "Forskare mäter mängden kol-14 i t.ex. trä eller ben.", k: [["mat", "undersok", "analys"]] },
    { f: "Mängden jämförs med stabilt kol (kol-12).", k: [["kol 12", "c 12", "kol12", "c12", "jamfor", "forhallande", "stabilt kol"]] },
    { f: "Materialets ålder beräknas – mindre kol-14 betyder äldre.", k: [["alder", "aldre", "gammal", "berakna", "rakna", "datera"]] },
  ]},
  { t: "Hur fungerar en kärnreaktor?", s: [
    { f: "Uran (uran-235) används som bränsle i bränslestavar.", k: [["uran", "bransle"]] },
    { f: "En neutron träffar en urankärna.", k: [["neutron"], ["traff", "fang", "skjut", "krock", "in i", "slar"]] },
    { f: "Kärnan klyvs (fission) – energi och nya neutroner frigörs.", k: [["klyv", "fission", "delas", "splittr"]] },
    { f: "En kedjereaktion uppstår.", k: [["kedje", "fler"]] },
    { f: "Reaktionen kontrolleras med styrstavar (och vatten).", k: [["styrstav", "kontroll", "regler", "styr"]] },
    { f: "Värmen kokar vatten till ånga som driver en turbin.", k: [["anga", "kok", "vatten", "varme"]] },
    { f: "Turbinen driver en generator som producerar elektricitet.", k: [["generator", "elektricitet", " el ", "strom", "elenergi"]] },
  ]},
  { t: "Hur styr man en kärnreaktor?", s: [
    { f: "Neutroner startar kärnklyvningar.", k: [["neutron"], ["klyv", "start", "orsak", "fission"]] },
    { f: "Vattnet bromsar neutronerna – det fungerar som moderator.", k: [["moderator", "broms", "saktar", "vatten"]] },
    { f: "Styrstavarna absorberar neutroner.", k: [["styrstav", "absorb", "fangar"]] },
    { f: "Reaktorn kan regleras eller stoppas (snabbstopp).", k: [["stopp", "stang", "regler", "avbryt", "minskar"]] },
  ]},
  { t: "Hur fungerar kärnklyvning och kedjereaktion?", s: [
    { f: "En neutron träffar en klyvbar kärna, t.ex. uran-235.", k: [["neutron", "uran"], ["traff", "fang", "krock", "uran", "skjut"]] },
    { f: "Kärnan blir instabil och delas i två mindre kärnor.", k: [["delas", "klyv", "tva mindre", "splittr", "instabil", "fission"]] },
    { f: "Energi frigörs och nya neutroner bildas.", k: [["energi", "varme"]] },
    { f: "De nya neutronerna kan klyva fler kärnor.", k: [["nya neutron", "fler", "andra karnor", "ytterligare", "nasta"]] },
    { f: "Reaktionen fortsätter som en kedjereaktion.", k: [["kedje", "fortsatter", "kontroller", "regler"]] },
  ]},
  { t: "Hur fungerar fusion – solens energikälla?", s: [
    { f: "Det finns lätta atomkärnor, i solen främst väte.", k: [["latt", "vate"]] },
    { f: "Temperaturen är extremt hög, så kärnorna rör sig snabbt.", k: [["temperatur", "varm", "hett", "het ", "snabb", "tryck"]] },
    { f: "Kärnorna förenas (smälter samman) när de kommer nära.", k: [["forena", "smalt", "samman", "ihop", "kollider", "nara"]] },
    { f: "En tyngre kärna bildas – väte blir helium.", k: [["tyngre", "helium"]] },
    { f: "Energi frigörs; lite massa blir energi.", k: [["energi"]] },
  ]},
  { t: "Vad betyder Einsteins formel E = mc²?", s: [
    { f: "Materia har massa, och massa är kopplad till energi.", k: [["materia", "koppl", "samband", "hanger ihop", "massa och energi", "energi och massa", "massa ar energi"]] },
    { f: "Massa kan omvandlas till energi.", k: [["omvandl", "blir energi", "bli energi", "till energi", "mindre massa"]] },
    { f: "Masskillnaden (massdefekten) blir energi.", k: [["skillnad", "massdefekt", "forsvinn", "minskar"]] },
    { f: "Ljusets hastighet (c) är så stor att lite massa ger mycket energi.", k: [["ljus", "hastighet", " c ", "300"]] },
  ]},
  { t: "Hur fungerar röntgenstrålning?", s: [
    { f: "Röntgenapparaten skapar energirik elektromagnetisk strålning.", k: [["skapa", "alstr", "sander", "apparat", "maskin", "hog energi", "energirik", "elektromagnet"]] },
    { f: "Strålningen passerar genom kroppen; vävnader absorberar olika mycket.", k: [["kropp", "passer", "genom", "vavnad"]] },
    { f: "Skelettet absorberar mer strålning än mjukdelar.", k: [["skelett", " ben", "skelet"]] },
    { f: "En detektor registrerar strålningen som passerat.", k: [["detektor", "plat", "film", "sensor", "registrer", "mater", "fangar"]] },
    { f: "En röntgenbild skapas där skelettet syns.", k: [["bild"]] },
  ]},
  { t: "Hur fungerar den fotoelektriska effekten?", s: [
    { f: "Ljus riktas mot en metallplatta.", k: [["metall"]] },
    { f: "Ljuset består av energikvanta, fotoner.", k: [["foton", "kvant", "ljuspartik", "energipaket"]] },
    { f: "En elektron absorberar energi från en foton.", k: [["absorb", "tar upp", "far energi", "overfor", "ger energi", "ger elektron"]] },
    { f: "Om energin räcker lämnar elektronen metallen.", k: [["lamnar", "frigor", "loss", "rycks", "slapper", "racker"]] },
    { f: "De frigjorda elektronerna kan ge elektrisk ström.", k: [["strom", "krets"]] },
  ]},
  { t: "Vad är isotoper?", s: [
    { f: "Alla atomer av samma grundämne har samma antal protoner.", k: [["proton"], ["samma"]] },
    { f: "Kärnorna kan ha olika många neutroner.", k: [["neutron"], ["olika", "antal", "fler", "farre"]] },
    { f: "Atomer av samma grundämne med olika antal neutroner kallas isotoper.", k: [["isotop"]] },
    { f: "Isotoper har olika masstal; vissa är stabila, andra radioaktiva.", k: [["masstal", "stabil", "radioaktiv", "massa", "vager"]] },
  ]},
  { t: "Vilka forskare gjorde de viktigaste upptäckterna? Skriv namn + vad de gjorde.", s: [
    { f: "Wilhelm Röntgen – upptäckte röntgenstrålningen 1895.", k: [["rontgen", "wilhelm"], ["stral", "1895"]] },
    { f: "J. J. Thomson – upptäckte elektronen 1897.", k: [["thomson", "tomson"], ["elektron", "1897"]] },
    { f: "Albert Einstein – förklarade Brownsk rörelse och den fotoelektriska effekten.", k: [["einstein"], ["brown", "fotoelektr", "ljus", "atom", "foton", "pollen", "rorelse", "relativ", "e mc", "emc"]] },
    { f: "Ernest Rutherford – visade att atomen har en liten positiv kärna.", k: [["rutherford", "ruterford", "ernest"], ["karn", "guld"]] },
    { f: "Niels Bohr – atommodell med bestämda energinivåer.", k: [["bohr", "niels"], ["niva", "nivaer", "skal", "bana", "modell"]] },
    { f: "Henri Becquerel – upptäckte radioaktiviteten 1896.", k: [["becquerel", "bequerel", "beckerel", "bekerel", "henri"], ["radioaktiv", "1896", "stral"]] },
  ]},
];

const GRADES = [
  { g: "A", min: 90 }, { g: "B", min: 78 }, { g: "C", min: 65 }, { g: "D", min: 50 }, { g: "E", min: 40 }, { g: "F", min: 0 },
];

// Vanliga missuppfattningar (från övningsfakta). Claude använder dem för att förklara fel.
const MISSUPPFATTNINGAR = [
  "Radioaktivt sönderfall är ingen kedjereaktion – kärnorna sönderfaller var för sig och slumpmässigt.",
  "Halveringstiden gäller många kärnor, inte en enskild kärna; man kan inte veta när en viss kärna sönderfaller.",
  "Det är atomkärnan, inte hela atomen eller elektronerna, som är instabil vid radioaktivitet.",
  "Vid betasönderfall blir en NEUTRON en proton och en elektron – inte tvärtom.",
  "Gammastrålning är elektromagnetisk strålning utan partiklar; alfa är en heliumkärna (2 protoner + 2 neutroner).",
  "Alfa stoppas av papper/huden, beta av några mm aluminium, gamma dämpas av tjockt bly eller betong.",
  "Fusion är ingen kedjereaktion – kedjereaktion hör till kärnklyvning (fission). Fission = tung kärna klyvs, fusion = lätta kärnor slås samman.",
  "Fusion kräver extremt hög temperatur och högt tryck så att kärnorna rör sig snabbt nog att komma nära varandra.",
  "Vid den fotoelektriska effekten bildas ingen ny atom – elektronen lämnar metallen och kan ge ström.",
  "E = mc²: E energi, m massa, c ljusets hastighet (ca 300 000 km/s). Eftersom c är så stort ger lite massa mycket energi.",
  "Kol-14 sönderfaller till kväve-14, halveringstid ca 5 730 år. Mindre kol-14 kvar = äldre material.",
  "Styrstavar absorberar neutroner; vattnet bromsar neutronerna (moderator). Snabbstopp = styrstavarna sänks ner helt.",
  "Isotoper: samma antal protoner, olika antal neutroner, alltså olika masstal.",
  "Einstein uppfann inte kärnreaktorn. Röntgen 1895, Becquerel 1896 (radioaktivitet), Thomson 1897 (elektronen).",
];

if (typeof module !== "undefined") module.exports = { QUESTIONS, GRADES, MISSUPPFATTNINGAR };
