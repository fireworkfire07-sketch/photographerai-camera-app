import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";

import { CAMERA_MODES } from "./cameraModes";
import { generateShotPlan } from "./shotEngine";
import { detectFace, analyzeFrame } from "./faceDetection";
import { calculatePhotoScore } from "./qualityEngine";
import { getPoseSuggestion, voiceGuide } from "./poseGuide";
import { getOverlayColor, getOverlayMessage } from "./scoreOverlay";
import { shouldCapture, captureBurstCount } from "./captureController";

export default function App() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [modeIndex, setModeIndex] = useState(0);
  const [photoCount, setPhotoCount] = useState(0);
  const [analysisResult, setAnalysisResult] = useState({
  score: 0,
  accepted: false,
  heroShot: false,
  issues: [],
});
  const [guideText, setGuideText] = useState("Ready");
  const [shotPlan] = useState(generateShotPlan(80));

  const currentMode = CAMERA_MODES[modeIndex];

  async function analyzeScene() {
    const face = await detectFace();
    const frame = analyzeFrame(null);

    const newScore = calculatePhotoScore({
      eyesOpen: face.eyesOpen,
      blur: frame.blur,
      faceVisible: face.detected,
      lighting: face.lightingGood ? 100 : 50,
      framing: face.faceCentered ? 100 : 60,
    });

    const poseMessage = getPoseSuggestion(face.faceCentered, face.lightingGood);

    setAnalysisResult(newScore);
    setGuideText(poseMessage);
    voiceGuide(poseMessage);

    return {
      face,
      frame,
      score: newScore,
    };
  }

  async function captureOne() {
    if (!cameraRef.current) return;

    await analyzeScene();

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.85,
      skipProcessing: false,
    });

    console.log("PHOTO:", photo.uri);
    setPhotoCount((prev) => prev + 1);
  }

  async function autoCaptureBurst() {
    const analysis = await analyzeScene();

    const canShoot = shouldCapture({
      score: analysis.score,
      eyesOpen: analysis.face.eyesOpen,
      faceCentered: analysis.face.faceCentered,
    });

    if (!canShoot) {
      setGuideText("Adjust position first");
      return;
    }

    const burst = captureBurstCount(analysis.score);

    for (let i = 0; i < burst; i++) {
      await captureOne();
    }

    setGuideText("Change pose now");
  }

  function nextMode() {
    setModeIndex((prev) => (prev + 1) % CAMERA_MODES.length);
  }

  if (!permission) {
    return <View style={styles.center}><Text>Loading camera...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow Camera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const overlayColor = getOverlayColor(analysisResult.score);
const overlayMessage = getOverlayMessage(analysisResult);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <SafeAreaView style={styles.overlay}>

          <View style={styles.topPanel}>
            <Text style={styles.title}>PHOTOGRAPHERAI</Text>
            <Text style={styles.mode}>{currentMode.name}</Text>
            <Text style={styles.counter}>Photos: {photoCount} / 80</Text>
            <Text style={[styles.score, { color: overlayColor }]}>
              {overlayMessage} | Score: {analysisResult.score}
            </Text>
          </View>

          <View style={[styles.frameBox, { borderColor: overlayColor }]}>
            <Text style={[styles.frameText, { color: overlayColor }]}>
              AI FRAME
            </Text>
          </View>

          <View style={styles.guidePanel}>
            <Text style={styles.guide}>{guideText}</Text>

            <Text style={styles.shot}>
              Next Shot: {shotPlan[photoCount]?.type || "Session complete"}
            </Text>

            <TouchableOpacity style={styles.captureButton} onPress={captureOne}>
              <Text style={styles.captureText}>CAPTURE 1 FRAME</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.autoButton} onPress={autoCaptureBurst}>
              <Text style={styles.captureText}>AUTO CAPTURE 7 FRAMES</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modeButton} onPress={nextMode}>
              <Text style={styles.captureText}>CHANGE MODE</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: "space-between" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  permissionText: { color: "#fff", fontSize: 18, marginBottom: 20 },

  topPanel: {
    margin: 18,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  title: { color: "#ff9900", fontSize: 24, fontWeight: "bold" },
  mode: { color: "#fff", marginTop: 6 },
  counter: { color: "#75ff93", marginTop: 6 },
  score: { marginTop: 8, fontWeight: "bold" },

  frameBox: {
    alignSelf: "center",
    width: "78%",
    height: "40%",
    borderWidth: 3,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  frameText: { fontWeight: "bold" },

  guidePanel: {
    margin: 18,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  guide: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  shot: { color: "#ccc", marginBottom: 14 },

  button: {
    backgroundColor: "#ff9900",
    padding: 16,
    borderRadius: 14,
  },
  captureButton: {
    backgroundColor: "#ff9900",
    padding: 15,
    borderRadius: 14,
    marginBottom: 10,
  },
  autoButton: {
    backgroundColor: "#00aa88",
    padding: 15,
    borderRadius: 14,
    marginBottom: 10,
  },
  modeButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 14,
  },
  buttonText: { color: "#000", fontWeight: "bold" },
  captureText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
