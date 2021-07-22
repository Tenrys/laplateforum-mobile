import React, { useContext, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StoreContext } from "../../store/StoreContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Threads from "./Threads";
import Thread from "./Thread";

const Stack = createStackNavigator();

export default function Home({ navigation }) {
	const { dispatch } = useContext(StoreContext);

	useEffect(() => {
		async function isSigned() {
			try {
				let data = await AsyncStorage.getItem("user");
				if (!data) return;
				const { user, token } = JSON.parse(data);
				if (token) {
					dispatch({ type: "SIGN_IN", data: { user, token } });
				}
			} catch (err) {
				console.error(err);
			}
		}
		isSigned();
	}, []);

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Threads" component={Threads} />
			<Stack.Screen name="Thread" component={Thread} />
		</Stack.Navigator>
	);
}
