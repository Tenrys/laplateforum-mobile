import React from "react";
import { UserReducer } from "../reducers/UserReducer";
import { StoreContext } from "./StoreContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export function UserState(props) {
	const [state, dispatch] = React.useReducer(UserReducer, {
		user: {
			token: null,
		},
		isLoading: true,
	});
	const [title, setTitle] = React.useState("");

	async function setDataToStorage(data) {
		const json = JSON.stringify(data);
		await AsyncStorage.setItem("user", json);
	}

	async function signIn(username, password) {
		const { data } = await axios.post("/auth/login", {
			username,
			password,
		});
		dispatch({ type: "SIGN_IN", data });
		setDataToStorage(data);
	}

	async function register(username, password) {
		await axios.post("/auth/register", {
			username,
			password,
		});
		signIn(username, password);
	}

	async function signOut() {
		dispatch({ type: "SIGN_OUT" });
		await AsyncStorage.removeItem("user");
	}

	return (
		<StoreContext.Provider
			value={{ signIn, signOut, register, state, dispatch, title, setTitle }}
		>
			{props.children}
		</StoreContext.Provider>
	);
}
