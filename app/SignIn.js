import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { Octicons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import CustomKeyboardView from "../components/CustomKeyboardView";
import { set } from "firebase/database";
import { useAuth } from "../context/authContext";

export default function SignIn() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Sign In", "Vui lòng nhâp đầy đủ thông tin!");
      return;
    }
    setLoading(true);
    const response = await login(emailRef.current, passwordRef.current);
    setLoading(false);
    console.log("Đăng nhập thành công: ", response);
    if (!response.success) {
      Alert.alert("Sign In", response.msg);
    } else {
      Alert.alert("Sign In", "Đăng nhập thành công");
      router.push("Home");
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <ImageBackground
      // source={require("../assets/images/backImage.png")}
      source={require("../assets/images/nen.jpg")}
      resizeMode="cover"
      style={myStyle.backgroundImage}
    >
      <CustomKeyboardView>
        <View style={{ paddingHorizontal: wp(2.5) }} className="flex-1">
          <StatusBar style="dark" />
          <View
            style={{ paddingTop: hp(10), paddingHorizontal: wp(6) }}
            className="gap-12"
          >
            <View className="items-center">
              <Image
                source={require("../assets/images/logo (1).png")}
                style={{ height: hp(25), width: wp(90) }}
                resizeMode="contain"
              />
            </View>
          </View>
          <View
            style={myStyle.viewText}
            className="gap-10 items-center rounded-2xl"
          >
            <Text
              style={{ fontSize: hp(5), paddingTop: hp(2), fontWeight: 700 }}
              className="font-bold tracking-wider text-center text-green-500"
            >
              Sign In
            </Text>
            <View style={{ marginTop: hp(-1) }} className="gap-4">
              <View
                style={myStyle.ViewInput}
                className="gap-4 px-4 flex-row  items-center rounded-2xl"
              >
                <Octicons name="mail" size={24} color="gray" />
                <TextInput
                  placeholder="Email"
                  style={myStyle.TextInput}
                  onChangeText={(value) => (emailRef.current = value)}
                />
              </View>
              <View className="gap-3">
                <View
                  style={myStyle.ViewInput}
                  className="gap-4 px-4 flex-row items-center rounded-2xl"
                >
                  <Octicons name="lock" size={24} color="gray" />
                  <TextInput
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    style={myStyle.TextInput}
                    onChangeText={(value) => (passwordRef.current = value)}
                  />
                  <TouchableOpacity
                    style={myStyle.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="grey"
                    />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{ fontSize: hp(1.8) }}
                  className="font-semibold text-right text-neutral-600"
                >
                  Forgot password?
                </Text>
              </View>
              <View>
                {loading ? (
                  <View className="flex-row justify-center">
                    <Loading size={hp(6.5)} />
                  </View>
                ) : (
                  <TouchableOpacity style={myStyle.login} onPress={handleLogin}>
                    <Text
                      style={{ fontSize: hp(2.7) }}
                      className="font-bold text-white tracking-wider"
                    >
                      Sign In
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View className="flex-row justify-center">
                <Text
                  style={{ fontSize: hp(1.8) }}
                  className="text-center text-neutral-600"
                >
                  Don't have an account?{" "}
                </Text>

                <Pressable onPress={() => router.push("SignUp")}>
                  <Text
                    style={{ fontSize: hp(2) }}
                    className="font-semibold text-center text-green-700"
                  >
                    Sign Up
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </CustomKeyboardView>
    </ImageBackground>
  );
}

const myStyle = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  viewText: {
    paddingHorizontal: wp(6),
    height: hp(48),
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.68)",
    zIndex: -1,
    borderWidth: 1.5,
    borderColor: "rgba(25, 255, 55, 0.5)",
  },

  ViewInput: {
    height: hp(7),
    width: wp(87),
    // marginTop: hp(-2),
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderWidth: 2,
    borderColor: "rgba(0, 255, 55, 0.5)",
  },

  TextInput: {
    fontSize: hp(2.4),
  },
  eyeIcon: {
    marginRight: wp(2),
    marginLeft: "auto",
  },
  login: {
    backgroundColor: "#32e385",
    borderRadius: 10,
    height: hp(6.5),
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});
