import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useContext, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { FAB, Icon } from "react-native-elements";
import { StoreContext } from "../../store/StoreContext";
import common, { colors } from "../../styles";
import Thread from "../Thread";

export default function Threads({ navigation }) {
	const { state, setTitle } = useContext(StoreContext);
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
			<>
				<ScrollView
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={fetchThreads} />
					}
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
				{state.token ? (
					<FAB
						placement="right"
						color={colors.purple}
						icon={<Icon type="material-community" name="plus" color="white"></Icon>}
						onPress={() => navigation.navigate("NewThread")}
						buttonStyle={{ borderRadius: 100 }}
					></FAB>
				) : null}
			</>
		);
	} else return <View style={common.container}>{content}</View>;
}
