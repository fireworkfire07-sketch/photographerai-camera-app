export const getPoseSuggestion = (faceCentered, lightingGood) => {
  if (!faceCentered) {
    return "Move slightly to center";
  }

  if (!lightingGood) {
    return "Turn toward the light";
  }

  return "Perfect pose";
};

export const voiceGuide = (message) => {
  console.log("VOICE:", message);
};
