import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

type Todo = {
  id: number;
  task: string;
  done: boolean;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState<string>("");
  const [message, setMessage] = useState<string>("No todos yet...");

  const API_URL = "http://10.0.2.2:3000/todos"; // Android emulator
  // For real devices, replace 10.0.2.2 with your PC's local IP

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const res = await fetch(API_URL);
      const data: Todo[] = await res.json();
      setTodos(data);
      if (data.length === 0) setMessage("No todos yet...");
      else setMessage(`Last task: ${data[data.length - 1].task}`);
    } catch {
      setMessage("Failed to fetch todos ??");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add todo
  const addTodo = async () => {
    if (!task) return Alert.alert("Please enter a task!");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      const newTodo: Todo = await res.json();
      setTodos([...todos, newTodo]);
      setMessage(`?? ${newTodo.task}`);
      setTask("");
    } catch {
      setMessage("Failed to add todo ??");
    }
  };

  // Toggle last todo done
  const toggleLastTodo = async () => {
    if (todos.length === 0) return;
    const last = todos[todos.length - 1];
    try {
      const res = await fetch(`${API_URL}/${last.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !last.done }),
      });
      const updated: Todo = await res.json();
      const newTodos = [...todos];
      newTodos[newTodos.length - 1] = updated;
      setTodos(newTodos);
      setMessage(`${updated.done ? "?" : "??"} ${updated.task}`);
    } catch {
      setMessage("Failed to update todo ??");
    }
  };

  // Delete last todo
  const deleteLastTodo = async () => {
    if (todos.length === 0) return;
    const last = todos[todos.length - 1];
    try {
      await fetch(`${API_URL}/${last.id}`, { method: "DELETE" });
      const newTodos = todos.slice(0, -1);
      setTodos(newTodos);
      setMessage(newTodos.length === 0 ? "No todos left!" : `Deleted: ${last.task}`);
    } catch {
      setMessage("Failed to delete todo ??");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>?? My To-Do List</Text>

      <Text style={styles.message}>{message}</Text>

      <TextInput
        placeholder="Enter a task"
        value={task}
        onChangeText={setTask}
        style={styles.input}
      />

      <Button title="Add Todo ??" onPress={addTodo} />
      <View style={{ height: 10 }} />
      <Button title="Toggle Last Done ?" onPress={toggleLastTodo} />
      <View style={{ height: 10 }} />
      <Button title="Delete Last ?" color="red" onPress={deleteLastTodo} />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleLastTodo()}
            style={styles.todoItem}
          >
            <Text style={[styles.taskText, item.done && styles.done]}>
              {item.done ? "?" : "??"} {item.task}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f2f2f2" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  message: { fontSize: 18, marginBottom: 15, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
  todoItem: { padding: 10, backgroundColor: "#fff", marginVertical: 5, borderRadius: 5 },
  taskText: { fontSize: 16 },
  done: { textDecorationLine: "line-through", color: "#999" },
});