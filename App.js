import React from "react";
import "moment/locale/fr";
import "react-native-url-polyfill/auto";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Login, Register, Home, EditProfile } from "./components/views";
import { UserDrawerProfile } from "./components";
import { UserState } from "./store/StoreState";
import { StoreContext } from "./store/StoreContext";
import { colors } from "./styles";
import axios from "axios";

axios.defaults.baseURL = "http://192.168.0.10:8000/api/v1";
axios.defaults.timeout = 3000;

export default function App() {
	const Drawer = createDrawerNavigator();

	return (
		<UserState>
			<StoreContext.Consumer>
				{({ state, title }) => {
					return (
						<>
							<NavigationContainer>
								<Drawer.Navigator
									drawerContentOptions={{
										activeTintColor: colors.purple,
										activeBackgroundColor: colors.purpleTranslucent,
										itemStyle: { marginVertical: 0 },
									}}
									drawerContent={props => <UserDrawerProfile {...props} />}
									screenOptions={{
										headerShown: true,
										headerStyle: {
											backgroundColor: colors.purple,
										},
										headerTintColor: "#fff",
									}}
								>
									<Drawer.Screen
										name="Home"
										options={{
											drawerLabel: "Accueil",
											title,
										}}
										component={Home}
									/>
									{!state.token ? (
										<>
											<Drawer.Screen
												name="Login"
												options={{
													drawerLabel: "Connexion",
													title: "Connexion",
												}}
												component={Login}
											/>
											<Drawer.Screen
												name="Register"
												options={{
													drawerLabel: "Inscription",
													title: "Inscription",
												}}
												component={Register}
											/>
										</>
									) : (
										<Drawer.Screen
											name="EditProfile"
											options={{
												drawerLabel: "Mon profil",
												title: "Mon profil",
											}}
											component={EditProfile}
										/>
									)}
								</Drawer.Navigator>
							</NavigationContainer>
							<StatusBar style="light" />
						</>
					);
				}}
			</StoreContext.Consumer>
		</UserState>
	);
}
