import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ChatRoomHeader from "../../components/ChatRoomHeader";
import MessageList from "../../components/MessageList";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather, Ionicons } from "@expo/vector-icons";
import CustomKeyboardView from "../../components/CustomKeyboardView";
import { useAuth } from "../../context/authContext";
import { getRoomId } from "../../utils/common";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { set } from "firebase/database";

export default function ChatRoom() {
  const item = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const textRef = useRef("");
  const inputRef = useRef(null);
  const scrollViewRef = useRef(null);
  useEffect(() => {
    createRoomIfNotExist();
    let roomId = getRoomId(user?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messageRef = collection(docRef, "messages");
    const q = query(messageRef, orderBy("createdAt", "asc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setMessages([...allMessages]);
    });
    const KeyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      updateScrollView
    );
    return () => {
      unsub();
      KeyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    updateScrollView();
  }, [messages]);

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }, 100);
  };

  const createRoomIfNotExist = async () => {
    let roomId = getRoomId(user?.userId, item?.userId);
    await setDoc(doc(db, "rooms", roomId), {
      roomId,
      createdAt: Timestamp.fromDate(new Date()),
    });
  };

  console.log("Chat Room", item);

  const hanldeSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;
    try {
      let roomId = getRoomId(user?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const messageRef = collection(docRef, "messages");
      textRef.current = "";
      if (inputRef) inputRef?.current?.clear();

      const newDoc = await addDoc(messageRef, {
        userId: user?.userId,
        text: message,
        createdAt: Timestamp.fromDate(new Date()),
        phone: user?.phone,
        senderName: user?.username,
      });
      console.log("Document written with ID: ", newDoc.id);
    } catch (err) {
      Alert.alert("Lỗi", err.message);
    }
  };

  console.log("Messages", messages);

  return (
    <CustomKeyboardView inChat={true}>
      <View className="flex-1 bg-white">
        <StatusBar style="dark" />
        <ChatRoomHeader user={item} router={router} />
        <View className="h-3 border-b border-neutral-300" />
        <View className="flex-1 justify-center bg-neutral-100 overflow-visible">
          <View className="flex-1">
            <MessageList
              scrollViewRef={scrollViewRef}
              messages={messages}
              currentUser={user}
            />
          </View>
          <View style={{ marginBottom: hp(1.7) }} className="pt-2">
            <View className="flex-row mx-3 justify-between bg-white border p-2 border-neutral-300 rounded-full pl-5">
              <TextInput
                ref={inputRef}
                onChangeText={(value) => (textRef.current = value)}
                placeholder="Nhập tin nhắn..."
                style={{ fontSize: hp(2) }}
                className="flex-1 mr-2"
              />
              <TouchableOpacity
                onPress={hanldeSendMessage}
                style={{
                  padding: hp(0.5),
                }}
              >
                <Ionicons name="send" size={hp(2.7)} color="green" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}
