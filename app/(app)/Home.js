import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ChatList from "../../components/ChatList";
import Loading from "../../components/Loading";
import { getDocs, query, where } from "firebase/firestore";
import { usersRef } from "../../firebaseConfig";

export default function Home() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const q = query(usersRef, where("userId", "!=", user?.uid));

    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data() });
    });

    setUsers(data);
  };

  useEffect(() => {
    if (user?.uid) getUsers();
  }, []);

  console.log("user: ", user);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      {users.length > 0 ? (
        <ChatList currentUser={user} users={users} />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {/* <ActivityIndicator size="large" /> */}
          <Loading size={hp(5)} />
        </View>
      )}
    </View>
  );
}
