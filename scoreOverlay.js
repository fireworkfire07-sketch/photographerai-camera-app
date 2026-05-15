export const getOverlayColor = (score) => {

  if (score >= 85) {
    return "lime";
  }

  if (score >= 70) {
    return "orange";
  }

  if (score >= 60) {
    return "yellow";
  }

  return "red";
};

export const getOverlayMessage = ({
  score,
  accepted,
  heroShot,
  issues = [],
}) => {

  if (heroShot) {
    return "🔥 HERO SHOT";
  }

  if (!accepted) {

    if (issues.includes("Eyes closed")) {
      return "❌ EYES CLOSED";
    }

    if (issues.includes("Photo is blurry")) {
      return "❌ BLURRY PHOTO";
    }

    if (issues.includes("Low lighting")) {
      return "⚠️ LOW LIGHT";
    }

    return "❌ REJECT FRAME";
  }

  if (score >= 70) {
    return "✅ GOOD FRAME";
  }

  return "⚠️ ADJUST POSITION";
};
