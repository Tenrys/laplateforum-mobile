import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import React, { useContext } from "react";
import { Text, View } from "react-native";
import { StoreContext } from "../store/StoreContext";
import UserAvatar from "./UserAvatar";

export default function UserDrawerProfile(props) {
	const { state, signOut } = useContext(StoreContext);
	const { user } = state;
	const { navigation } = props;

	return (
		<DrawerContentScrollView {...props}>
			{state.token ? (
				<View
					style={{
						alignItems: "center",
						justifyContent: "flex-start",
						marginVertical: 5,
					}}
				>
					<UserAvatar user={user} onPress={() => navigation.navigate("EditProfile")} />
					<Text style={{ fontSize: 20, marginVertical: 8 }}>{state.user.username}</Text>
				</View>
			) : null}
			<DrawerItemList {...props} />
			{state.token ? (
				<DrawerItem
					label="Déconnexion"
					onPress={() => {
						signOut();
						navigation.closeDrawer();
					}}
				/>
			) : null}
		</DrawerContentScrollView>
	);
}
