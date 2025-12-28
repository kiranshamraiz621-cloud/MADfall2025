import axios from "axios";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [randomItem, setRandomItem] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const API_URL = "http://localhost:3000"; // Use LAN IP if testing on device

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/menu`);
      setMenu(res.data);
      setRandomItem(null);
      setShowMenu(true);
    } catch (err) {
      console.error("Error fetching menu:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandom = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/menu/random`);
      setRandomItem(res.data);
      setShowMenu(false);
    } catch (err) {
      console.error("Error fetching random item:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d4af37" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.itemInfo}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>Rs. {item.price}</Text>
        </View>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={item.inStock ? styles.inStock : styles.outOfStock}>
          {item.inStock ? "In Stock" : "Out of Stock"}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}> Coffee Shop</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.surpriseButton}
          onPress={fetchRandom}
        >
          <Text style={styles.buttonText}>Surprise Me!</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={fetchMenu}>
          <Text style={styles.buttonText}>Full Menu</Text>
        </TouchableOpacity>
      </View>

      {randomItem && (
        <View style={styles.surpriseCard}>
          <Image source={{ uri: randomItem.image }} style={styles.surpriseImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.name}>{randomItem.name}</Text>
            <Text style={styles.category}>{randomItem.category}</Text>
            <Text style={styles.description}>{randomItem.description}</Text>
            <Text style={styles.price}>Rs. {randomItem.price}</Text>
            <Text style={randomItem.inStock ? styles.inStock : styles.outOfStock}>
              {randomItem.inStock ? "Available" : "Out of Stock"}
            </Text>
          </View>
        </View>
      )}

      {showMenu && <FlatList data={menu} keyExtractor={(item) => item._id} renderItem={renderItem} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "bold", color: "#d4af37", textAlign: "center", marginBottom: 20 },
  buttonContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  surpriseButton: { backgroundColor: "#d4af37", padding: 15, borderRadius: 10, marginHorizontal: 10 },
  menuButton: { backgroundColor: "#333", padding: 15, borderRadius: 10, marginHorizontal: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  card: { backgroundColor: "#1a1a1a", borderRadius: 15, flexDirection: "row", alignItems: "center", padding: 10, marginBottom: 15 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  image: { width: 100, height: 100, borderRadius: 12, marginRight: 10 },
  itemInfo: { flex: 1 },
  name: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  category: { color: "#aaa", fontSize: 14 },
  description: { color: "#ccc", fontSize: 13, fontStyle: "italic", marginTop: 5 },
  price: { color: "#d4af37", fontWeight: "bold", marginTop: 5 },
  inStock: { color: "#4CAF50", fontWeight: "bold", marginTop: 3 },
  outOfStock: { color: "#FF4D4D", fontWeight: "bold", marginTop: 3 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  loadingText: { marginTop: 10, color: "#d4af37" },
  surpriseCard: { backgroundColor: "#111", borderRadius: 20, alignItems: "center", padding: 20, marginBottom: 25 },
  surpriseImage: { width: 180, height: 180, borderRadius: 15, marginBottom: 10 },
});
