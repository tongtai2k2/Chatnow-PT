import { View, Text } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function MessageItem({ message, currentUser }) {
  const renderTime = () => {
    if (message) {
      let date = new Date(message?.createdAt.seconds * 1000);
      let hours = date.getHours();
      let minutes = date.getMinutes();
      return `${hours}:${minutes}`;
    }
  };
  if (message?.userId === currentUser?.userId) {
    return (
      <View className="flex-row justify-end mb-3 mr-3">
        <View style={{ width: wp(80) }}>
          <View className="flex self-end p-3 rounded-2xl bg-white border border-neutral-300">
            <Text style={{ fontSize: hp(2), fontWeight: 450 }}>
              {message?.text}
            </Text>
            <Text
              style={{ fontSize: hp(1.5), color: "grey", textAlign: "right" }}
            >
              {renderTime(message)}
            </Text>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ width: hp(80) }} className="ml-3 mb-3">
        <View
          className="flex self-start p-3 px-4 rounded-2xl"
          style={{
            backgroundColor: "lightgreen",
            borderWidth: 1.5,
            borderColor: "rgba(25, 255, 55, 0.5)",
          }}
        >
          <Text style={{ fontSize: hp(2), fontWeight: 450 }}>
            {message?.text}
          </Text>
          <Text style={{ fontSize: hp(1.5), color: "grey", textAlign: "left" }}>
            {renderTime(message)}
          </Text>
        </View>
      </View>
    );
  }
}
