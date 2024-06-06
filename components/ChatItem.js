import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { blurhash, fromDate, getRoomId } from "../utils/common";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const ChatItem = ({ item, router, noBorder, currentUser }) => {
  const [lastMessage, setLastMessage] = useState(undefined);
  // useEffect(() => {
  //   let roomId = getRoomId(currentUser?.userId, item?.userId);
  //   const docRef = doc(db, "rooms", roomId);
  //   const messageRef = collection(docRef, "messages");
  //   const q = query(messageRef, orderBy("createdAt", "desc"));

  //   let unsub = onSnapshot(q, (snapshot) => {
  //     let allMessages = snapshot.docs.map((doc) => {
  //       return doc.data();
  //     });
  //     setLastMessage(allMessages[0] ? allMessages[0] : null);
  //   });
  //   return unsub;
  // }, []);
  useEffect(() => {
    let roomId = getRoomId(currentUser?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messageRef = collection(docRef, "messages");
    const q = query(messageRef, orderBy("createdAt", "desc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setLastMessage(allMessages[0] ? allMessages[0] : null);
    });

    return unsub;
  }, [item, currentUser]);
  const openChatRoom = () => {
    router.push({ pathname: "/ChatRoom", params: item });
  };

  // const renderTime = () => {
  //   if (lastMessage) {
  //     let date = new Date(lastMessage?.createdAt.seconds * 1000);
  //     let hours = date.getHours();
  //     let minutes = date.getMinutes();
  //     return `${hours}:${minutes}`;

  //   }
  // };
  const renderTime = () => {
    if (lastMessage) {
      let currentDate = new Date();
      let messageDate = new Date(lastMessage?.createdAt.seconds * 1000);
      let timeDiff = (currentDate - messageDate) / (1000 * 60); // Đổi sang phút

      if (timeDiff < 1) {
        return "Vừa xong";
      } else if (timeDiff < 60) {
        return `${Math.floor(timeDiff)} phút trước`;
      } else if (timeDiff < 1440) {
        // 1440 phút trong 1 ngày
        return `${Math.floor(timeDiff / 60)} giờ trước`;
      } else if (timeDiff < 7200) {
        // 7200 phút trong 5 ngày
        return `${Math.floor(timeDiff / 1440)} ngày trước`;
      } else {
        return `${messageDate.getDate()}/${
          messageDate.getMonth() + 1
        } - ${messageDate.getHours()}:${messageDate.getMinutes()}`;
      }
    }
  };

  const renderLastMessage = () => {
    if (typeof lastMessage == "undefined") return "Loading...";
    if (lastMessage) {
      if (currentUser.userId == lastMessage?.userId) {
        return `You: ${lastMessage?.text}`;
      }
      return lastMessage?.text;
    } else {
      return "Say hi 👋";
    }
  };

  return (
    <TouchableOpacity
      onPress={openChatRoom}
      style={[myStyle.container, noBorder && myStyle.borderBottom]}
    >
      <Image
        source={require("../assets/images/avatar1.jpg")}
        style={myStyle.image}
        placeholder={blurhash}
        transition={1000}
      />

      <View style={myStyle.container1}>
        <View style={myStyle.row}>
          <Text style={myStyle.nameText}>{item?.username}</Text>
          <Text style={myStyle.timeText}>{renderTime()}</Text>
        </View>
        <Text style={myStyle.messageText}>{renderLastMessage()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const myStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: wp(4),
    marginBottom: hp(1),
    padding: hp(1),
    marginTop: hp(-2),
    borderBottomWidth: 0.25,
    borderBottomColor: "rgb(200, 200, 200)",
  },
  image: {
    height: hp(6),
    width: hp(6),
    borderRadius: hp(100),
  },
  container1: {
    flex: 1,
    marginVertical: hp(1),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameText: {
    fontSize: hp(2),
    fontWeight: "600",
    color: "black",
    marginLeft: wp(2),
  },
  timeText: {
    fontSize: hp(1.5),
    fontWeight: "500",
    color: "rgb(150, 150, 150)",
  },
  messageText: {
    fontSize: hp(1.5),
    fontWeight: "500",
    color: "rgb(150, 150, 150)",
    marginLeft: wp(2),
  },
  borderBottom: {
    borderBottomWidth: 0.1,
    borderBottomColor: "rgb(200, 200, 200)",
  },
});

export default ChatItem;
