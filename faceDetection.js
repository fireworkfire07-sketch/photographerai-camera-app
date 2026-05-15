export const detectFace = async () => {
  return {
    detected: true,
    eyesOpen: true,
    faceCentered: true,
    lightingGood: true,
  };
};

export const analyzeFrame = (frame) => {
  return {
    blur: 10,
    quality: 92,
  };
};
