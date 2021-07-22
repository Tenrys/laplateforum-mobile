import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import "moment/locale/fr";
import React from "react";
import "react-native-url-polyfill/auto";
import { UserDrawerProfile } from "./components";
import { EditProfile, Home, Login, Register } from "./components/views";
import { StoreContext } from "./store/StoreContext";
import { UserState } from "./store/StoreState";
import { colors } from "./styles";
import { host } from "./env";

axios.defaults.baseURL = `http://${host}/api/v1`;
axios.defaults.timeout = 10000;

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
									drawerType="slide"
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
