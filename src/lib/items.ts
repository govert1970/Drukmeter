// Unload teamversie — itempool v0.2 (niet gevalideerd)
// v0.2: R1 en H3 herschreven; O5 en V6 (werk/privé) tellen niet meer mee in een vlakscore.
export const SCALES: Record<string, string[]> = {
  W: ["Helemaal niet waar", "Nauwelijks waar", "Deels waar", "Grotendeels waar", "Helemaal waar"],
  F: ["(Bijna) nooit", "Een paar keer per maand", "Wekelijks", "Een paar keer per week", "(Bijna) dagelijks"],
  INT: ["Zelden", "Een paar keer per week", "Dagelijks", "Een paar keer per dag", "Elk uur of vaker"],
  NACHT: ["Geen enkele nacht", "1 nacht", "2–3 nachten", "4–5 nachten", "6–7 nachten"]
};

export type Dim = { id: string; naam: string; wat: string };
export const DIMS: Dim[] = [
  { id: "T", naam: "Taaklast", wat: "Het gewicht van het werk zelf: hoeveel, hoe complex, hoe versnipperd." },
  { id: "D", naam: "Beslislast", wat: "Hoeveel beslissingen je draagt, hoe zwaar ze zijn en wat ze aan het eind van de dag kosten." },
  { id: "R", naam: "Relatielast", wat: "Het gewicht van mensen: overleg, lastige relaties en de energie die het kost om je professioneel te houden." },
  { id: "O", naam: "Rollast", wat: "Hoeveel petten je draagt, hoe vaak je schakelt en hoe helder de grenzen zijn." },
  { id: "H", naam: "Hersteltekort", wat: "Hoe goed je bijtankt: slaap, energie en opladen. Een hoge score betekent wéinig herstel." },
  { id: "V", naam: "Verborgen last", wat: "Wat onder de oppervlakte meeloopt: open eindjes, piekeren en onderhuidse zorg." }
];

// rev:true = omgekeerd gescoord (hoog antwoord = weinig last)
export type Item = { id: string; d: string; s: string; q: string; rev?: boolean; wp?: boolean };
export const ITEMS: Item[] = [
  { id: "T1", d: "T", s: "W", q: "Op een gewone werkdag heb ik meer op mijn bord dan ik met volle aandacht kan doen." },
  { id: "T2", d: "T", s: "F", q: "Mijn werk vraagt dat ik me inwerk in onderwerpen die nieuw of onduidelijk voor me zijn." },
  { id: "T3", d: "T", s: "INT", q: "Hoe vaak word je onderbroken terwijl je inhoudelijk ergens mee bezig bent?" },
  { id: "T4", d: "T", s: "W", rev: true, q: "In een gewone week heb ik blokken van een uur of langer waarin ik ongestoord kan doordenken." },
  { id: "T5", d: "T", s: "F", q: "Ik pak iets op dat ik eerder half heb laten liggen en moet me er eerst weer in verdiepen." },

  { id: "D1", d: "D", s: "W", q: "Op een gewone dag neem ik zoveel beslissingen dat ik ze 's avonds niet meer kan opnoemen." },
  { id: "D2", d: "D", s: "F", q: "Kleine, praktische beslissingen komen bij mij terecht, terwijl een ander ze ook had kunnen nemen." },
  { id: "D3", d: "D", s: "W", q: "Aan het eind van de dag neem ik beslissingen sneller of slordiger dan 's ochtends." },
  { id: "D4", d: "D", s: "W", q: "Er liggen beslissingen bij mij die ik al langer voor me uitschuif." },
  { id: "D5", d: "D", s: "F", q: "Ik moet beslissen zonder de informatie die ik eigenlijk nodig heb." },

  { id: "R1", d: "R", s: "W", q: "Tussen gesprekken door heb ik geen moment om even op adem te komen." },
  { id: "R2", d: "R", s: "F", q: "In een gesprek laat ik een andere stemming zien dan ik op dat moment voel." },
  { id: "R3", d: "R", s: "W", q: "Er is op dit moment een werkrelatie die me veel energie kost." },
  { id: "R4", d: "R", s: "W", q: "Na een lastig gesprek heb ik tijd nodig voordat ik weer helder ben voor het volgende." },
  { id: "R5", d: "R", s: "W", q: "De mensen met wie ik werk hebben weinig zicht op hoe het werkelijk met me gaat." },

  { id: "O1", d: "O", s: "F", q: "Ik schakel op één dag tussen petten die weinig met elkaar te maken hebben." },
  { id: "O2", d: "O", s: "W", rev: true, q: "Het is me duidelijk waar mijn verantwoordelijkheid ophoudt en die van een ander begint." },
  { id: "O3", d: "O", s: "F", q: "Verschillende mensen verwachten tegelijk dingen van me die niet samengaan." },
  { id: "O4", d: "O", s: "W", q: "Ik word aangesproken op resultaten waar ik maar beperkt invloed op heb." },
  { id: "O5", d: "O", s: "W", wp: true, q: "Werk en privé concurreren bij mij om dezelfde tijd en energie." },

  { id: "H1", d: "H", s: "NACHT", q: "Hoeveel nachten per week slaap je minder dan je nodig hebt?" },
  { id: "H2", d: "H", s: "F", rev: true, q: "Ik word uitgerust wakker." },
  { id: "H3", d: "H", s: "W", rev: true, q: "Aan het eind van een werkdag heb ik nog energie over voor iets anders." },
  { id: "H4", d: "H", s: "W", rev: true, q: "Na een vrij weekend voel ik me weer opgeladen." },
  { id: "H5", d: "H", s: "W", q: "Dingen die ik normaal makkelijk aankan, irriteren me nu sneller." },

  { id: "V1", d: "V", s: "W", q: "Ik draag onafgemaakte zaken in mijn hoofd mee die ik nergens heb opgeschreven." },
  { id: "V2", d: "V", s: "F", q: "In mijn vrije tijd ben ik in gedachten met werk bezig." },
  { id: "V3", d: "V", s: "F", q: "Werk houdt me 's nachts wakker of maakt me wakker." },
  { id: "V4", d: "V", s: "W", q: "Ik heb een onderhuids gevoel dat er iets mis kan gaan wat ik nog niet zie." },
  { id: "V5", d: "V", s: "W", q: "In mijn rol voel ik dat ik iemand moet zijn die ik niet helemaal ben." },
  { id: "V6", d: "V", s: "W", wp: true, q: "Mijn privéomstandigheden vragen op dit moment veel van me." }
];

// Vaste, gemengde volgorde zodat dimensies niet herkenbaar in blokken staan
export const ORDER: string[] = ["T1","R1","H1","D1","O1","V1","T3","R2","D2","H2","O2","V2","T2","D3","R3","H3","O3","V3","T4","D4","R4","H4","O4","V4","T5","D5","R5","H5","O5","V5","V6"];
