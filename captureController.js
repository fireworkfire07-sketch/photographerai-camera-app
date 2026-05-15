export const shouldCapture = ({
  score,
  eyesOpen,
  faceCentered,
}) => {
  if (!eyesOpen) return false;

  if (!faceCentered) return false;

  if (score < 85) return false;

  return true;
};

export const captureBurstCount = () => {
  return 7;
};
