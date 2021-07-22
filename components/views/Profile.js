import axios from "axios";
import * as Linking from "expo-linking";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Text } from "react-native-elements";
import { StoreContext } from "../../store/StoreContext";
import common, { colors } from "../../styles";
import UserAvatar from "../UserAvatar";

const roleNameMapping = {
	member: "Membre",
	admin: "Administrateur",
};

function StatBubble({ value, children }) {
	return (
		<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					width: 48,
					height: 48,
					borderWidth: 1,
					borderColor: colors.purple,
					backgroundColor: colors.purpleTranslucent,
					borderRadius: 100,
					marginBottom: 4,
				}}
			>
				<Text style={{ fontSize: 24, color: colors.purple }}>{value}</Text>
			</View>
			<Text>{children}</Text>
		</View>
	);
}

export default function Profile({ route }) {
	const { id } = route.params;
	const { state, setTitle } = useContext(StoreContext);
	const [user, setUser] = useState(null);
	const [stats, setStats] = useState(null);

	async function fetchUser() {
		// setRefreshing(true);
		try {
			const {
				data: { result: user },
			} = await axios.get(`/users/${id}`);
			setUser(user);
			const {
				data: { result: stats },
			} = await axios.get(`/users/${id}/stats`);
			setStats(stats);

			setTitle(`Profil de ${user.username}`);
		} catch (e) {
			console.error(e);
		}
		// setRefreshing(false);
	}

	useEffect(() => {
		fetchUser();
	}, []);

	let placeholder = <ActivityIndicator size="large" color={colors.purple} />;
	if (user && stats) {
		const { username, avatar, role, status, website, twitter, createdAt } = user;
		const { threads, posts, votes } = stats;

		return (
			<ScrollView>
				<View
					style={{
						padding: 12,
						backgroundColor: colors.purpleTranslucent,
						borderTopWidth: 1,
						borderBottomWidth: 1,
						borderColor: "#00000020",
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<UserAvatar
						size="large"
						user={{ id, avatar }}
						containerStyle={{ marginRight: 12 }}
					/>
					<View>
						<Text style={{ fontSize: 18, fontWeight: "bold" }}>{username}</Text>
						<Text style={{ fontSize: 14 }}>
							{roleNameMapping[role.name] || role.name}
						</Text>
						{status ? (
							<Text style={{ fontSize: 14, marginVertical: 8, textStyle: "italic" }}>
								{status}
							</Text>
						) : null}
						<Text style={{ fontSize: 12, color: "#000000a0" }}>
							a rejoint {moment(createdAt).locale("fr").fromNow()}
						</Text>
						<View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
							{website ? (
								<Text
									style={{
										textDecorationLine: "underline",
										color: colors.purple,
										marginRight: 4,
									}}
									onPress={() => {
										Linking.openURL(website);
									}}
								>
									Website
								</Text>
							) : null}
							{twitter ? (
								<Text
									style={{
										textDecorationLine: "underline",
										color: colors.purple,
									}}
									onPress={() => {
										Linking.openURL(`https://twitter.com/${twitter}`);
									}}
								>
									Twitter
								</Text>
							) : null}
						</View>
					</View>
				</View>
				<View
					style={{
						padding: 12,
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-around",
					}}
				>
					<StatBubble value={threads}>Sujets</StatBubble>
					<StatBubble value={posts}>Messages</StatBubble>
					<StatBubble value={votes}>Votes</StatBubble>
				</View>
			</ScrollView>
		);
	} else return <View style={common.container}>{placeholder}</View>;
}
