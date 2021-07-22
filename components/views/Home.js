import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import EditPost from "./EditPost";
import EditThread from "./EditThread";
import NewPost from "./NewPost";
import NewThread from "./NewThread";
import Profile from "./Profile";
import Thread from "./Thread";
import Threads from "./Threads";

const Stack = createStackNavigator();

export default function Home({ navigation }) {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Threads" component={Threads} />
			<Stack.Screen name="Thread" component={Thread} />
			<Stack.Screen name="NewThread" component={NewThread} />
			<Stack.Screen name="EditThread" component={EditThread} />
			<Stack.Screen name="NewPost" component={NewPost} />
			<Stack.Screen name="EditPost" component={EditPost} />
			<Stack.Screen name="Profile" component={Profile} />
		</Stack.Navigator>
	);
}
