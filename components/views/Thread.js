import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../store/StoreContext";
import {
	Text,
	TextInput,
	Button,
	View,
	StyleSheet,
	ActivityIndicator,
	ScrollView,
	RefreshControl,
} from "react-native";
import common, { colors } from "../../styles";
import axios from "axios";
import Post from "../Post";

const style = StyleSheet.create({
	input: {
		flex: 1,
		fontSize: 16,
		padding: 4,
		borderWidth: 1,
		borderColor: "#0000007f",
		borderRadius: 2,
	},
});

export default function Thread({ route }) {
	const { state, setTitle } = useContext(StoreContext);
	const [thread, setThread] = useState(null);
	const [body, setBody] = useState("");
	const [error, setError] = React.useState(null);
	const [sending, setSending] = React.useState(false);
	const [refreshing, setRefreshing] = React.useState(false);

	async function fetchPosts() {
		setRefreshing(true);
		try {
			const { data } = await axios.get(`/threads/${route.params.id}`);

			setThread(data.result);
			setTitle(data.result.title);
		} catch (e) {
			console.error(e);
		}
		setRefreshing(false);
	}

	async function sendPost() {
		setSending(true);
		try {
			await axios.post(`/threads/${route.params.id}`, {
				body,
			});
			await fetchPosts();
			setBody("");
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
		setSending(false);
	}

	useEffect(() => {
		fetchPosts();
	}, []);

	let placeholder = <ActivityIndicator size="large" color={colors.purple} />;
	if (thread) {
		return (
			<ScrollView
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPosts} />}
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
				{state.token ? (
					<View style={{ flexGrow: 1, flexDirection: "row", padding: 12 }}>
						{error ? <Text style={{ color: "red" }}>{error}</Text> : null}
						<TextInput
							style={style.input}
							onChangeText={setBody}
							multiline
							placeholder="Envoyer une réponse..."
						/>
						{/* TODO: Markdown editor?? */}
						<Button
							title={sending ? "Envoi..." : "Envoyer"}
							onPress={sendPost}
							disabled={!sending && body.length < 7}
							color={colors.purple}
						/>
					</View>
				) : null}
			</ScrollView>
		);
	} else return <View style={common.container}>{placeholder}</View>;
}
