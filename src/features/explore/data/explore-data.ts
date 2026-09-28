export const exploreFilters = [
  { key: 'all', label: 'Tümü' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'pilates', label: 'Pilates' },
  { key: 'reformer', label: 'Reformer' },
] as const;

export type ExploreFilterKey = (typeof exploreFilters)[number]['key'];

export const explorePractices = [
  {
    id: 'morning-flow',
    title: 'Sabah Akışı',
    discipline: 'yoga',
    disciplineLabel: 'Yoga',
    duration: '15 dk',
    level: 'Başlangıç',
    description: 'Güne nefes ve nazik hareketlerle başla.',
  },
  {
    id: 'core-control',
    title: 'Core Kontrol',
    discipline: 'pilates',
    disciplineLabel: 'Pilates',
    duration: '25 dk',
    level: 'Orta',
    description: 'Merkez bölgeni güçlendiren kontrollü bir pratik.',
  },
  {
    id: 'full-body-reformer',
    title: 'Tüm Beden Reformer',
    discipline: 'reformer',
    disciplineLabel: 'Reformer',
    duration: '35 dk',
    level: 'Orta',
    description: 'Direnç ve kontrollü hareketlerle tüm bedeni çalıştır.',
  },
  {
    id: 'evening-release',
    title: 'Akşam Rahatlama',
    discipline: 'yoga',
    disciplineLabel: 'Yoga',
    duration: '20 dk',
    level: 'Başlangıç',
    description: 'Günün gerginliğini yavaş bir akışla geride bırak.',
  },
] as const;
