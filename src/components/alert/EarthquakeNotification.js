import smallEarthQuakeSound from "../assets/audio/Mini-Alert.mp3";

export const playEarthquakeAlert = () => {
    const notif = new Audio(smallEarthQuakeSound);
    notif.play();
  };