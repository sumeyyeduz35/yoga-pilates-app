export const homeDisciplines = [
  {
    key: 'yoga',
    title: 'Yoga',
    description: 'Nefes & denge',
    icon: 'leaf-outline',
  },
  {
    key: 'pilates',
    title: 'Pilates',
    description: 'Güç & kontrol',
    icon: 'body-outline',
  },
  {
    key: 'reformer',
    title: 'Reformer',
    description: 'Direnç & hareket',
    icon: 'fitness-outline',
  },
] as const;

export const continuePractice = {
  title: 'Tüm Beden Akışı',
  discipline: 'Pilates',
  duration: '24 dk',
  progress: 62,
} as const;

export const featuredPractice = {
  title: 'Sabah Akışı',
  description:
    'Bedeni nazikçe uyandıran, nefes ve hareketi bir araya getiren kısa bir yoga pratiği.',
  duration: '15 dk',
  level: 'Başlangıç',
} as const;
