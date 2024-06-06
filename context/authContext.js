import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { set } from "firebase/database";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "../firebaseConfig";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        updateUserData(user.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unsub;
  }, []);

  const updateUserData = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      setUser({
        ...user,
        username: data.username,
        phone: data.phone,
        userId: data.userId,
      });
    }
  };

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const userData = {
        email: response?.user?.email,
        password: password,
      };
      return { TK: userData, success: true };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)")) {
        msg = "Email không hợp lệ";
      } else if (msg.includes("(auth/user-not-found)")) {
        msg = "Email không tồn tại";
      } else if (msg.includes("(auth/wrong-password)")) {
        msg = "Mật khẩu không đúng";
      } else if (msg.includes("(auth/network-request-failed)")) {
        msg = "Lỗi mạng";
      }
      return { success: false, msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (e) {
      return { success: false, msg: e.message, error: e };
    }
  };

  const register = async (email, password, username, phone) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // console.log("response.user: ", response?.user);

      // setUser(response?.user);
      // setIsAuthenticated(true);

      await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        phone,
        userId: response?.user?.uid,
      });
      const userData = {
        email: response?.user?.email,
        password: password,
      };
      return { TK: userData, success: true };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)")) {
        msg = "Email không hợp lệ";
      } else if (msg.includes("(auth/email-already-in-use)")) {
        msg = "Email đã được sử dụng";
      } else if (msg.includes("(auth/network-request-failed)")) {
        msg = "Lỗi mạng";
      } else if (msg.includes("(auth/weak-password)")) {
        msg = "Mật khẩu tối thiểu 6 ký tự";
      }
      return { success: false, msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return value;
};
