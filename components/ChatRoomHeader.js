import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";

export default function ChatRoomHeader({ user, router }) {
  return (
    <Stack.Screen
      options={{
        title: "",
        headerShadowVisible: false,
        headerLeft: () => (
          <View style={myStyle.row}>
            <TouchableOpacity onPress={() => router.back()}>
              <Entypo name="chevron-left" size={hp(4)} color="#737373" />
            </TouchableOpacity>
            <View style={myStyle.row}>
              <Image
                source={require("../assets/images/avatar1.jpg")}
                style={myStyle.image}
              />
              <Text style={myStyle.text}>{user?.username}</Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <View style={myStyle.rowIcon}>
            <Ionicons
              name="call"
              size={hp(2.5)}
              color="#737373"
              style={myStyle.iconCall}
            />
            <Ionicons
              name="videocam"
              size={hp(2.5)}
              color="#737373"
              style={myStyle.icon}
            />
            <Ionicons
              name="information-circle"
              size={hp(2.5)}
              color="#737373"
            />
          </View>
        ),
      }}
    />
  );
}

const myStyle = StyleSheet.create({
  image: {
    height: hp(4.5),
    width: hp(4.5),
    borderRadius: hp(100),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  rowIcon: {
    flexDirection: "row",
    alignItems: "center",
    // marginRight: 30,
    backgroundColor: "white",
  },
  text: {
    fontSize: hp(2),
    fontFamily: "Roboto",
    color: "black",
    marginLeft: wp(2),
  },
  icon: {
    marginHorizontal: hp(1.5), // Đặt khoảng cách ngang bên cạnh biểu tượng
  },
  iconCall: {
    marginHorizontal: hp(0.5), // Đặt khoảng cách ngang bên cạnh biểu tượng
  },
});
