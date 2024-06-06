import { View, Text, Platform, StyleSheet } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { blurhash } from "../utils/common";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { MenuItem } from "./CustomMenuItems";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useAuth } from "../context/authContext";

const android = Platform.OS === "android";

export default function HomeHeader() {
  const { top } = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const handleProfile = () => {};
  const handleLogout = async () => {
    await logout();
  };
  return (
    <View
      style={{
        paddingTop: android ? top : top + 10,
        backgroundColor: "#32e385",
        height: hp("11"),
      }}
      className="flex-row justify-between px-5 pd-6 rounded-b-3xl shadow"
    >
      <View>
        <Text style={myStyle.textHead} className="font-medium">
          Chats{" "}
        </Text>
      </View>
      <View>
        <Menu>
          <MenuTrigger
            style={{ borderRadius: 100, marginTop: hp(2) }}
            customStyles={{ triggerWrapper: {} }}
          >
            <Image
              style={myStyle.image}
              source="https://picsum.photos/seed/696/3000/2000"
              placeholder={blurhash}
              transition={1000}
            />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                borderRadius: 12,
                borderCurve: "continuous",
                marginTop: hp(7),
                marginLeft: 10,
                width: wp(40),
                backgroundColor: "white",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
              },
            }}
          >
            <MenuItem
              text="Profile"
              action={handleProfile}
              value={null}
              icon={<Feather name="user" size={hp(2.5)} color="#737373" />}
            />
            <View className="border-t border-gray-200"></View>
            <MenuItem
              text="Sign out"
              action={handleLogout}
              value={null}
              icon={
                <MaterialCommunityIcons
                  name="logout"
                  size={hp(2.5)}
                  color="#737373"
                />
              }
            />
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
}

const myStyle = StyleSheet.create({
  textHead: {
    fontSize: hp(3.5),
    marginTop: hp(2),
    color: "white",
    fontWeight: "bold",
  },
  image: {
    height: hp(4.3),
    aspectRatio: 1,
    borderRadius: 100,
    // marginTop: hp(2),
  },
});
