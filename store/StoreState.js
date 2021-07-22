import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { UserReducer } from "../reducers/UserReducer";
import { StoreContext } from "./StoreContext";
import { host } from "../env";
import io from "socket.io-client";

let socket;
let refreshOnlineInterval;

export function UserState(props) {
	const [state, dispatch] = useReducer(UserReducer, {
		user: null,
		isLoading: true,
	});
	const [title, setTitle] = useState("");

	const updateOnline = async () => {
		const {
			data: {
				result: { online },
			},
		} = await axios.get(`/users/online`);
		dispatch({ type: "UPDATE_ONLINE", data: { online } });
	};

	const socketConnect = token => {
		return new Promise((resolve, reject) => {
			socket = io(`http://${host}`, { transports: ["websocket"], query: { token } });
			socket.on("connect", async () => {
				console.log("Connected to application");

				resolve();
			});
			socket.on("disconnect", () => {
				console.log("Disconnected");
			});
			socket.on("error", err => {
				reject();
			});
		});
	};

	const setDataToStorage = async data => {
		const json = JSON.stringify(data);
		await AsyncStorage.setItem("user", json);
	};

	const signIn = async (username, password) => {
		const { data } = await axios.post("/auth/login", {
			username,
			password,
		});
		console.log("A It errors around here");
		dispatch({ type: "SIGN_IN", data });
		console.log("B It errors around here");
		await socketConnect(data.token).then(updateOnline);
		setDataToStorage(data);
	};

	const register = async (username, password) => {
		await axios.post("/auth/register", {
			username,
			password,
		});
		signIn(username, password);
	};

	const signOut = async () => {
		dispatch({ type: "SIGN_OUT" });
		socket.close();
		updateOnline();
		await AsyncStorage.removeItem("user");
	};

	const signBackIn = async () => {
		try {
			let data = await AsyncStorage.getItem("user");
			if (!data) return;
			const { user, token } = JSON.parse(data);
			if (token) {
				dispatch({ type: "SIGN_IN", data: { user, token } });
				await socketConnect(token);
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (refreshOnlineInterval) clearInterval(refreshOnlineInterval);
		signBackIn().finally(() => {
			updateOnline();
			refreshOnlineInterval = setInterval(updateOnline, 60000);
		});
	}, []);

	return (
		<StoreContext.Provider
			value={{ signIn, signOut, register, state, dispatch, title, setTitle }}
		>
			{props.children}
		</StoreContext.Provider>
	);
}
