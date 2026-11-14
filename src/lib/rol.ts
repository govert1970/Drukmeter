// Soort rol van de deelnemers. Bepaalt alleen de bewoording van inleiding en uitleg, niet de vragen of de scores.
export type Rol = 'directie' | 'management' | 'professional';
export const ROLLEN: { id: Rol; label: string; rol: string; team: string; solo: string; als: string }[] = [
  { id: 'directie', label: 'Directie of executive', rol: 'directierol', team: 'Druk hoort bij een rol in een directieteam.', solo: 'Druk hoort bij een directierol.', als: 'als directie' },
  { id: 'management', label: 'Senior management', rol: 'senior managementrol', team: 'Druk hoort bij een rol in een managementteam.', solo: 'Druk hoort bij een senior managementrol.', als: 'als managementteam' },
  { id: 'professional', label: 'Senior professional', rol: 'senior professionele rol', team: 'Druk hoort bij een zware professionele rol.', solo: 'Druk hoort bij een zware professionele rol.', als: 'als team' }
];
export function rolVan(v: unknown): Rol { return v === 'management' || v === 'professional' ? v : 'directie'; }
export function opening(rol: Rol, individueel: boolean): string { const r = ROLLEN.find(x => x.id === rol)!; return individueel ? r.solo : r.team; }
// Zet de standaardbewoording (directie) om naar de gekozen rol.
export function rolTekst(tekst: string, rol: Rol, individueel: boolean): string {
  const r = ROLLEN.find(x => x.id === rol)!;
  return tekst
    .split('Druk hoort bij een rol in een directieteam.').join(individueel ? r.solo : r.team)
    .split('directierol').join(r.rol)
    .split('als directie zelf').join(r.als + ' zelf');
}
