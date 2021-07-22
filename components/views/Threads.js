import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../store/StoreContext";
import { View, ActivityIndicator, ScrollView, RefreshControl } from "react-native";
import common, { colors } from "../../styles";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import Thread from "../Thread";
import { useCallback } from "react";

export default function Threads({ navigation }) {
	const { setTitle } = useContext(StoreContext);
	const [threads, setThreads] = useState(null);
	const [refreshing, setRefreshing] = React.useState(false);

	const fetchThreads = async () => {
		setRefreshing(true);
		try {
			const { data } = await axios.get("/threads");

			setThreads(data.result);
		} catch (err) {
			console.error(err);
			setThreads(false);
		}
		setRefreshing(false);
	};

	useFocusEffect(
		useCallback(() => {
			fetchThreads();

			setTitle("Accueil");
		}, [])
	);

	let content = <ActivityIndicator size="large" color={colors.purple} />;
	if (threads) {
		return (
			<ScrollView
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchThreads} />}
			>
				{threads.map(thread => {
					return (
						<Thread
							key={thread.id}
							{...thread}
							onPress={() => navigation.navigate("Thread", { id: thread.id })}
						/>
					);
				})}
			</ScrollView>
		);
	} else return <View style={common.container}>{content}</View>;
}
