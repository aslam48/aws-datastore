import "core-js/full/symbol/async-iterator";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Button,
  Pressable,
} from "react-native";

import {
  withAuthenticator,
  useAuthenticator,
} from "@aws-amplify/ui-react-native";
import config from "./src/aws-exports";
import Amplify from "@aws-amplify/core";
import { DataStore } from "@aws-amplify/datastore";
// import config from "./src/aws-exports";
import { useEffect, useState } from "react";
import { Note, Task } from "./src/models";
Amplify.configure(config);

// retrieves only the current value of 'user' from 'useAuthenticator'
// const userSelector = (context) => [context.user];

// const SignOutButton = () => {
//   const { user, signOut } = useAuthenticator(userSelector);
//   return (
//     <View>
//       <Text style={styles.buttonText}>
//         Hello, {user.username}! Click here to sign out!
//       </Text>
//       <View style={{ width: 100, marginBottom: 50 }}>
//         <Button
//           title="Sign out"
//           onPress={signOut}
//           style={styles.buttonContainer}
//         />
//       </View>
//     </View>
//   );
// };

 App = () => {
  const initialTaskState = {
    title: "",
    description: "",
    status: "",
  };
  const initialNoteState = {
    content: "",
  };
  const [taskData, setTaskData] = useState(initialTaskState);
  const [noteData, setNoteData] = useState(initialNoteState);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);

  const handleChangeTask = (name, value) => {
    setTaskData({ ...taskData, [name]: value });
  };

  const handleChangeNote = (name, value) => {
    setNoteData({ ...noteData, [name]: value });
  };

  const handleSubmit = async () => {
    addTask();
    addNote();
  };

  
  useEffect(() => {
    const fetchAndSetData = async () => {
      await Promise.all([fetchTasks(), fetchNotes()]);
    };

    const subscriptions = [
      DataStore.observe(Task).subscribe(fetchTasks),
      DataStore.observe(Note).subscribe(fetchNotes),
    ];

    fetchAndSetData();

    return () => {
      subscriptions.forEach((sub) => sub.unsubscribe());
    };
  }, []);


  const addTask = async () => {
    try {
      if (!taskData.title || !taskData.description) return;
      const task = await DataStore.save(new Task({ ...taskData }));
      console.log("Task save successfully", task);
      setTaskData(initialTaskState);
      setNoteData(initialNoteState)
    } catch (err) {
      console.log("error creating task:", err);
    }
  };

  const addNote = async () => {
    try {
      if (!noteData.content) return;
      const note = await DataStore.save(new Note({ ...noteData }));
      console.log("Note save successfully", note);
    } catch (err) {
      console.log("error creating note:", err);
    }
  };

  const fetchTasks = async () => {
    console.log("am fetching task");
    try {
      const tasks = await DataStore.query(Task);
      // console.log("all post", tasks)
      setTasks(tasks);
    } catch (err) {
      console.log("error fetching tasks");
    }
  };

  const fetchNotes = async () => {
    console.log("am fetching note");
    try {
      const notes = await DataStore.query(Note);
      // console.log("all post", notes)
      setNotes(notes);
    } catch (err) {
      console.log("error fetching notes");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* <SignOutButton /> */}
        <Text style={styles.formLabel}>Add Task Here</Text>
        <TextInput
          style={styles.input}
          value={taskData.title}
          placeholder="Title"
          onChangeText={(text) => handleChangeTask("title", text)}
          keyboardType="default"
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={taskData.description}
          onChangeText={(text) => handleChangeTask("description", text)}
          keyboardType="default"
        />
        {/* <TextInput
          style={styles.input}
          placeholder="Status"
          value={taskData.status}
          onChangeText={(text) => handleChangeTask("status", text)}
        /> */}
        {/* <Text style={styles.formLabel}>Add note Here</Text>
        <TextInput
          style={styles.input}
          placeholder="Content"
          value={noteData.content}
          onChangeText={(text) => handleChangeNote("content", text)}
        /> */}
        <Button title="create" onPress={handleSubmit} />
        {tasks.map((task) => {
          const { id, title, description } = task;
          return (
            <View key={id}>
              <Text>{`Title:   ${title}  Desicription:  ${description}`}</Text>
            </View>
          );
        })}

        {/* <Text>{title}</Text> */}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 400,
    flex: 1,
    padding: 20,
    alignSelf: "center",
    marginTop: 30,
  },
  task: { marginBottom: 15 },
  input: {
    backgroundColor: "#ddd",
    marginBottom: 10,
    borderRadius: 27,
    padding: 10,
    fontSize: 18,
  },
  taskName: { fontSize: 20, fontWeight: "bold" },
  formLabel: { textAlign: "center", fontWeight: "bold", fontSize: 20 },
  buttonContainer: {
    marginHorizontal: 15,
    alignSelf: "center",
    backgroundColor: "black",
    paddingHorizontal: 8,
  },
  buttonText: { backgroundColor: "black", color: "white", padding: 16, fontSize: 18 },
});

// export default withAuthenticator(App);
export default App
