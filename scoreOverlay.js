export const getOverlayColor = (score) => {
  if (score >= 85) {
    return "lime";
  }

  if (score >= 70) {
    return "orange";
  }

  return "red";
};

export const getOverlayMessage = (score) => {
  if (score >= 85) {
    return "HERO SHOT";
  }

  if (score >= 70) {
    return "GOOD FRAME";
  }

  return "ADJUST POSITION";
};
