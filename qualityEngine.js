export const calculatePhotoScore = ({
  eyesOpen = true,
  blur = 0,
  faceVisible = true,
  lighting = 100,
  framing = 100,
}) => {
  let score = 0;

  if (eyesOpen) score += 30;
  if (faceVisible) score += 25;

  score += Math.max(0, 25 - blur);

  score += lighting * 0.1;
  score += framing * 0.1;

  return Math.min(100, Math.round(score));
};

export const isHeroShot = (score) => {
  return score >= 85;
};
