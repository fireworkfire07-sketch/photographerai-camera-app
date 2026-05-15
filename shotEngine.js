export const SHOT_TYPES = [
  "0.5x wide atmosphere",
  "1x full body",
  "1x medium portrait",
  "2x close portrait",
  "3x hero detail",
  "vertical social crop",
  "cinematic horizontal"
];

export const generateShotPlan = (targetCount = 80) => {
  const shots = [];

  while (shots.length < targetCount) {
    SHOT_TYPES.forEach((shot) => {
      shots.push({
        type: shot,
        captured: false,
      });
    });
  }

  return shots.slice(0, targetCount);
};
