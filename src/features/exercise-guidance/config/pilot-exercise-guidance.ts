import type {
    ExerciseGuidanceConfig,
} from '../types/exercise-guidance';

export const pilotExerciseGuidanceConfigs: Record<
  string,
  ExerciseGuidanceConfig
> = {
  'cat-cow-stretch': {
    exerciseSlug: 'cat-cow-stretch',
    discipline: 'yoga',

    animation: {
      assetKey: 'cat-cow-stretch',
      stateMachineName: 'ExercisePlayer',
      supportedViews: ['front', 'side'],
      defaultView: 'side',
      supportsMuscleOverlay: true,
    },

    audio: {
      enabled: true,
      voiceAssetKey: 'cat-cow-stretch-tr',
    },

    muscles: [
      {
        id: 'erector-spinae',
        name: 'Omurga çevresi kasları',
        role: 'primary',
      },
      {
        id: 'rectus-abdominis',
        name: 'Karın kasları',
        role: 'secondary',
      },
    ],

    breathCues: [
      {
        id: 'cat-cow-inhale-1',
        atSeconds: 0,
        type: 'inhale',
        label: 'Nefes al',
      },
      {
        id: 'cat-cow-exhale-1',
        atSeconds: 4,
        type: 'exhale',
        label: 'Nefes ver',
      },
    ],

    voiceCues: [
      {
        id: 'cat-cow-voice-1',
        atSeconds: 0,
        text: 'Nefes alırken göğsünü aç ve omurganı kontrollü şekilde uzat.',
      },
      {
        id: 'cat-cow-voice-2',
        atSeconds: 4,
        text: 'Nefes verirken sırtını yuvarla ve karnını içeri çek.',
      },
    ],

    fallback: {
      staticImageAssetKey: 'cat-cow-stretch',
      textInstruction:
        'Nefesinle birlikte omurganı kontrollü şekilde fleksiyon ve ekstansiyon arasında hareket ettir.',
    },
  },

  'the-hundred': {
    exerciseSlug: 'the-hundred',
    discipline: 'pilates',

    animation: {
      assetKey: 'the-hundred',
      stateMachineName: 'ExercisePlayer',
      supportedViews: ['front', 'side'],
      defaultView: 'side',
      supportsMuscleOverlay: true,
    },

    audio: {
      enabled: true,
      voiceAssetKey: 'the-hundred-tr',
    },

    muscles: [
      {
        id: 'rectus-abdominis',
        name: 'Karın kasları',
        role: 'primary',
      },
      {
        id: 'transverse-abdominis',
        name: 'Derin core kasları',
        role: 'primary',
      },
      {
        id: 'hip-flexors',
        name: 'Kalça fleksörleri',
        role: 'secondary',
      },
    ],

    breathCues: [
      {
        id: 'hundred-inhale-1',
        atSeconds: 0,
        type: 'inhale',
        label: '5 vuruş boyunca nefes al',
      },
      {
        id: 'hundred-exhale-1',
        atSeconds: 5,
        type: 'exhale',
        label: '5 vuruş boyunca nefes ver',
      },
    ],

    voiceCues: [
      {
        id: 'hundred-voice-1',
        atSeconds: 0,
        text: 'Core bölgeni aktif tut ve kollarını kontrollü şekilde pompala.',
      },
      {
        id: 'hundred-voice-2',
        atSeconds: 5,
        text: 'Boynunu sıkmadan nefes ritmini koru.',
      },
    ],

    fallback: {
      staticImageAssetKey: 'the-hundred',
      textInstruction:
        'Karın bölgesini aktif tutarak kolları kontrollü biçimde yukarı ve aşağı hareket ettir.',
    },
  },

  'reformer-footwork': {
    exerciseSlug: 'reformer-footwork',
    discipline: 'reformer',

    animation: {
      assetKey: 'reformer-footwork',
      stateMachineName: 'ExercisePlayer',
      supportedViews: ['front', 'side'],
      defaultView: 'side',
      supportsMuscleOverlay: true,
    },

    audio: {
      enabled: true,
      voiceAssetKey: 'reformer-footwork-tr',
    },

    muscles: [
      {
        id: 'quadriceps',
        name: 'Ön bacak kasları',
        role: 'primary',
      },
      {
        id: 'gluteus-maximus',
        name: 'Kalça kasları',
        role: 'primary',
      },
      {
        id: 'hamstrings',
        name: 'Arka bacak kasları',
        role: 'secondary',
      },
      {
        id: 'calves',
        name: 'Baldır kasları',
        role: 'secondary',
      },
    ],

    breathCues: [
      {
        id: 'footwork-exhale-1',
        atSeconds: 0,
        type: 'exhale',
        label: 'İterken nefes ver',
      },
      {
        id: 'footwork-inhale-1',
        atSeconds: 3,
        type: 'inhale',
        label: 'Dönerken nefes al',
      },
    ],

    voiceCues: [
      {
        id: 'footwork-voice-1',
        atSeconds: 0,
        text: 'Platformu kontrollü şekilde it ve diz hizanı koru.',
      },
      {
        id: 'footwork-voice-2',
        atSeconds: 3,
        text: 'Carriage geri gelirken hareketi yavaşlat ve kontrolü bırakma.',
      },
    ],

    fallback: {
      staticImageAssetKey: 'reformer-footwork',
      textInstruction:
        'Bacakları kontrollü şekilde uzat ve carriage dönüşünde hizanı koru.',
    },
  },
};