// Pressure Map — English texts for itempool v0.4 (not validated).
// Same ids and order as items.ts. Not yet wired into the app.
export const TITLE_EN = { tool: 'Pressure Map', personal: 'Where does pressure accumulate?', team: 'Where does pressure accumulate?' };

export const SCALES_EN: Record<string, string[]> = {
  W: ["Not true at all", "Hardly true", "Partly true", "Largely true", "Completely true"],
  F: ["(Almost) never", "A few times a month", "Weekly", "A few times a week", "(Almost) daily"],
  INT: ["Rarely", "A few times a week", "Daily", "A few times a day", "Hourly or more"],
  NACHT: ["None", "1 night", "2–3 nights", "4–5 nights", "6–7 nights"]
};

export const DIMS_EN: Record<string, { naam: string; wat: string }> = {
  T: { naam: "Task load", wat: "The weight of the work itself: how much there is, how complex it is and how often your attention is interrupted." },
  D: { naam: "Decision load", wat: "The decisions you carry: how many there are, how heavily they weigh and what they cost you by the end of the day." },
  R: { naam: "Relational load", wat: "What people at work ask of you: many meetings, a difficult working relationship, and staying professional while it feels different inside." },
  O: { naam: "Role load", wat: "The hats you wear: how often you switch, how clear your responsibility is and whether expectations clash." },
  P: { naam: "Private load", wat: "What comes at you at home: what needs arranging, decisions, relationships and expectations." },
  G: { naam: "Discretionary space", wat: "How much you can adjust yourself: setting your own diary, saying no, handing work over and falling back on others. High is good here." },
  H: { naam: "Recovery deficit", wat: "How much recovery you are missing: sleep, energy at the end of the day and recharging at the weekend. High means little recovery." },
  V: { naam: "Hidden load", wat: "What runs along beneath the surface: loose ends in your head, worrying outside working hours and a nagging concern." }
};

export const ITEMS_EN: Record<string, string> = {
  T1: "On a normal working day I have more on my plate than I can do with full attention.",
  T2: "My work requires me to get to grips with topics that are new or unclear to me.",
  T3: "How often are you interrupted while you are in the middle of substantive work?",
  T4: "In a normal week I have blocks of an hour or more in which I can think without being disturbed.",
  T5: "I pick up something I left half-finished earlier and first have to get back into it.",
  D1: "On a normal day I make so many decisions that by the evening I can no longer list them.",
  D2: "Small, practical decisions end up with me when someone else could have made them.",
  D3: "At the end of the day I make decisions faster or more carelessly than in the morning.",
  D4: "There are decisions waiting for me that I have been putting off for some time.",
  D5: "I have to decide without the information I really need.",
  R1: "Between conversations I have no moment to catch my breath.",
  R2: "In a conversation I show a different mood from the one I feel at that moment.",
  R3: "There is currently a working relationship that costs me a lot of energy.",
  R4: "After a difficult conversation I need time before I am clear-headed for the next one.",
  R5: "The people I work with have little idea of how I am really doing.",
  O1: "Within a single day I switch between hats that have little to do with each other.",
  O2: "It is clear to me where my responsibility ends and someone else's begins.",
  O3: "Different people expect things from me at the same time that cannot be combined.",
  O4: "I am held accountable for results over which I have only limited influence.",
  O5: "My role has recently grown without anything being taken off my plate.",
  P1: "At home, much of what needs arranging or doing falls to me.",
  P2: "There are private decisions that weigh heavily on me.",
  P3: "There is a relationship in my private life that currently costs me a lot of energy.",
  P4: "In my private life people expect more from me than I can give right now.",
  S1: "My work comes at the expense of the time and energy I need at home.",
  S2: "What is going on at home comes at the expense of my attention at work.",
  G1: "I largely decide for myself what my diary looks like.",
  G2: "I can say no to a request without it costing me anything.",
  G3: "I decide for myself how I approach my work.",
  G4: "When it gets too much, I can hand work over to someone else.",
  G5: "There are people I can fall back on when things get tough.",
  H1: "How many nights a week do you sleep less than you need?",
  H2: "I wake up feeling rested.",
  H3: "At the end of a working day I still have energy left for something else.",
  H4: "After a free weekend I feel recharged.",
  H5: "Things I normally handle easily now irritate me more quickly.",
  V1: "I carry unfinished matters in my head that I have not written down anywhere.",
  V2: "In my free time my thoughts are on work.",
  V3: "Work keeps me awake at night or wakes me up.",
  V4: "I have a nagging feeling that something could go wrong that I cannot yet see.",
  V5: "In my role I feel I have to be someone I am not entirely."
};
