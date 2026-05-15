import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [photoCount, setPhotoCount] = useState(0);
  const [guideText, setGuideText] = useState("Face the light");
  const cameraRef = useRef(null);

  const guidanceList = [
    "Move slightly left",
    "Face the light",
    "Lower your chin",
    "Natural smile",
    "Step closer",
    "Hold this pose",
    "Change pose now",
    "Look cinematic",
  ];

  useEffect(() => {
    (async () => {
      const { status } =
        await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const random =
        guidanceList[
          Math.floor(Math.random() * guidanceList.length)
        ];
      setGuideText(random);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const captureBurst = async () => {
    if (!cameraRef.current) return;

    for (let i = 0; i < 7; i++) {
      await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      setPhotoCount((prev) => prev + 1);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>No camera access</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={cameraRef}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>
            PHOTOGRAPHERAI CAMERA
          </Text>

          <Text style={styles.guide}>
            {guideText}
          </Text>

          <Text style={styles.counter}>
            Photos: {photoCount}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={captureBurst}
          >
            <Text style={styles.buttonText}>
              CAPTURE 7 FRAMES
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flip}
            onPress={() => {
              setType(
                type === CameraType.back
                  ? CameraType.front
                  : CameraType.back
              );
            }}
          >
            <Text style={styles.buttonText}>
              FLIP CAMERA
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  camera: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 60,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  guide: {
    color: "#00ffcc",
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "600",
  },

  counter: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#00aa88",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 20,
  },

  flip: {
    backgroundColor: "#444",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
