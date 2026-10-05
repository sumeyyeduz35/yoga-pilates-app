import {
  useEffect,
  useState,
} from 'react';
import { View } from 'react-native';

import {
  Fit,
  RiveView,
  useRive,
  useRiveFile,
} from '@rive-app/react-native';

import { Typography } from '@/components/ui/Typography';

type RiveExercisePlayerProps = {
  isPaused: boolean;
  onLoadError?: () => void;
};

export function RiveExercisePlayer({
  isPaused,
  onLoadError,
}: RiveExercisePlayerProps) {
  const {
    riveViewRef,
    setHybridRef,
  } = useRive();

  const {
    riveFile,
    isLoading,
    error,
  } = useRiveFile(
    require('../../../../assets/rive/vehicles.riv'),
  );

  const [hasError, setHasError] =
    useState(false);

  useEffect(() => {
    if (error) {
      setHasError(true);
      onLoadError?.();
    }
  }, [
    error,
    onLoadError,
  ]);

  useEffect(() => {
    if (!riveViewRef) {
      return;
    }

    if (isPaused) {
      riveViewRef.pause();
      return;
    }

    riveViewRef.play();
  }, [
    isPaused,
    riveViewRef,
  ]);

  if (hasError) {
    return (
      <View className="h-full w-full items-center justify-center">
        <Typography
          variant="body"
          tone="muted"
          className="text-center"
        >
          Animasyon yüklenemedi.
        </Typography>
      </View>
    );
  }

  if (
    isLoading ||
    !riveFile
  ) {
    return (
      <View className="h-full w-full items-center justify-center">
        <Typography
          variant="body"
          tone="muted"
        >
          Animasyon hazırlanıyor...
        </Typography>
      </View>
    );
  }

  return (
    <View className="h-full w-full">
      <RiveView
        file={riveFile}
        hybridRef={setHybridRef}
        autoPlay
        fit={Fit.Contain}
        artboardName="Truck"
        stateMachineName="bumpy"
        style={{
          width: '100%',
          height: '100%',
        }}
        onError={() => {
          setHasError(true);
          onLoadError?.();
        }}
      />
    </View>
  );
}