export const shouldCapture = ({
  score,
  eyesOpen,
  faceCentered,
  faceVisible = true,
  blur = 0,
  lighting = 100,
}) => {

  if (!eyesOpen) {
    return {
      capture: false,
      reason: "Eyes closed",
    };
  }

  if (!faceVisible) {
    return {
      capture: false,
      reason: "Face not visible",
    };
  }

  if (!faceCentered) {
    return {
      capture: false,
      reason: "Face not centered",
    };
  }

  if (blur > 15) {
    return {
      capture: false,
      reason: "Photo is blurry",
    };
  }

  if (lighting < 40) {
    return {
      capture: false,
      reason: "Low lighting",
    };
  }

  if (score < 60) {
    return {
      capture: false,
      reason: "Low quality score",
    };
  }

  return {
    capture: true,
    reason: "Capture approved",
  };
};

export const captureBurstCount = (score = 0) => {
  if (score >= 90) return 10;
  if (score >= 85) return 7;
  if (score >= 70) return 5;
  return 3;
};
