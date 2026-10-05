export type ExerciseView = 'front' | 'side';

export type ExercisePlaybackRate = 0.5 | 0.75 | 1;

export type ExerciseDiscipline =
  | 'yoga'
  | 'pilates'
  | 'reformer';

export type ExerciseGuidanceAssetStatus =
  | 'available'
  | 'missing'
  | 'failed';

export type ExerciseMuscleRole =
  | 'primary'
  | 'secondary';

export type ExerciseMuscle = {
  id: string;
  name: string;
  role: ExerciseMuscleRole;
};

export type ExerciseBreathCueType =
  | 'inhale'
  | 'exhale'
  | 'hold'
  | 'neutral';

export type ExerciseBreathCue = {
  id: string;
  atSeconds: number;
  type: ExerciseBreathCueType;
  label: string;
};

export type ExerciseVoiceCue = {
  id: string;
  atSeconds: number;
  text: string;
  audioAssetKey?: string;
};

export type ExerciseAnimationConfig = {
  assetKey: string;
  stateMachineName?: string;

  supportedViews: ExerciseView[];
  defaultView: ExerciseView;

  supportsMuscleOverlay: boolean;
};

export type ExerciseAudioConfig = {
  enabled: boolean;
  voiceAssetKey?: string;
};

export type ExerciseGuidanceFallback = {
  staticImageAssetKey?: string;
  textInstruction?: string;
};

export type ExerciseGuidanceConfig = {
  exerciseSlug: string;
  discipline: ExerciseDiscipline;

  animation: ExerciseAnimationConfig;
  audio: ExerciseAudioConfig;

  muscles: ExerciseMuscle[];
  breathCues: ExerciseBreathCue[];
  voiceCues: ExerciseVoiceCue[];

  fallback: ExerciseGuidanceFallback;
};

export type ExerciseGuidancePlayerState = {
  view: ExerciseView;
  playbackRate: ExercisePlaybackRate;

  isPaused: boolean;
  showMuscles: boolean;
  voiceEnabled: boolean;
};