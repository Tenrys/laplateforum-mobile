import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useContext, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { FAB, Icon } from "react-native-elements";
import { StoreContext } from "../../store/StoreContext";
import common, { colors } from "../../styles";
import Post from "../Post";

export default function Thread({ navigation, route }) {
	const { id } = route.params;
	const { state, setTitle } = useContext(StoreContext);
	const { user } = state;
	const [thread, setThread] = useState(null);
	const [refreshing, setRefreshing] = React.useState(false);

	const hasPermission = user?.role?.isAdmin;

	async function fetchPosts() {
		setRefreshing(true);
		try {
			const { data } = await axios.get(`/threads/${id}`);

			setThread(data.result);
			setTitle(data.result.title);
		} catch (e) {
			console.error(e);
		}
		setRefreshing(false);
	}

	useFocusEffect(
		useCallback(() => {
			fetchPosts();
		}, [])
	);

	let placeholder = <ActivityIndicator size="large" color={colors.purple} />;
	if (thread) {
		return (
			<>
				<ScrollView
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={fetchPosts} />
					}
				>
					{thread.posts.map((post, i) => {
						return (
							<Post
								firstPost={i == 0}
								key={i}
								{...post}
								thread={thread}
								doRefresh={fetchPosts}
							/>
						);
					})}
				</ScrollView>
				{state.token && (!thread.closed || hasPermission) ? (
					<FAB
						placement="right"
						color={colors.purple}
						icon={<Icon type="material" name="reply" color="white"></Icon>}
						onPress={() => {
							navigation.navigate("NewPost", { id });
						}}
						buttonStyle={{ borderRadius: 100 }}
					></FAB>
				) : null}
			</>
		);
	} else return <View style={common.container}>{placeholder}</View>;
}
