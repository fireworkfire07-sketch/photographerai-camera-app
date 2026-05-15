export const calculatePhotoScore = ({
  eyesOpen = true,
  blur = 0,
  faceVisible = true,
  lighting = 100,
  framing = 100,
  smile = 50,
  symmetry = 50,
  exposure = 50,
}) => {

  let score = 0;
  let issues = [];

  // Göz kontrolü
  if (eyesOpen) {
    score += 20;
  } else {
    issues.push("Eyes closed");
  }

  // Yüz görünürlüğü
  if (faceVisible) {
    score += 20;
  } else {
    issues.push("Face not visible");
  }

  // Blur kontrolü
  const sharpnessScore = Math.max(0, 20 - blur);
  score += sharpnessScore;

  if (blur > 15) {
    issues.push("Photo is blurry");
  }

  // Işık
  score += lighting * 0.1;

  if (lighting < 40) {
    issues.push("Low lighting");
  }

  // Kadraj
  score += framing * 0.1;

  if (framing < 40) {
    issues.push("Bad framing");
  }

  // Gülümseme
  score += smile * 0.05;

  // Simetri
  score += symmetry * 0.05;

  // Exposure
  score += exposure * 0.05;

  const finalScore = Math.min(100, Math.round(score));

  return {
    score: finalScore,
    accepted: finalScore >= 60,
    heroShot: finalScore >= 85,
    issues,
  };
};

export const isHeroShot = (score) => {
  return score >= 85;
};
