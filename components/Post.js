import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";
import React, { useContext } from "react";
import { Alert, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { MarkdownView } from "react-native-markdown-view";
import { StoreContext } from "../store/StoreContext";
import { colors } from "../styles";
import MyTags from "./MyTags";
import UserAvatar from "./UserAvatar";

function ActionButton(props) {
	const { align } = props;

	let style;
	switch (align) {
		case "l":
			style = { marginLeft: 0, marginRight: 12 };
			break;
		case "r":
			style = { marginRight: 0, marginLeft: 12 };
			break;
	}

	return (
		<TouchableOpacity style={style} {...props}>
			<Text style={{ fontSize: 17 }}>{props.children}</Text>
		</TouchableOpacity>
	);
}

export default function Post(props) {
	const navigation = useNavigation();
	const { state } = useContext(StoreContext);
	const { user } = state;
	const { firstPost, id, body, author, thread, votes, createdAt, updatedAt, doRefresh } = props;

	const modified = createdAt !== updatedAt;
	const hasPermission = author.id == user?.id || user?.role?.isAdmin;

	const vote = async up => {
		if (!user) {
			if (ToastAndroid && ToastAndroid.show)
				ToastAndroid.show("Please log in to vote", ToastAndroid.SHORT);
			return;
		}

		const currentVote = votes.find(vote => vote.userId === user.id);

		if (!currentVote || currentVote.up != up) {
			await axios.post(`/threads/${thread.id}/${id}/vote`, { up });
		} else {
			await axios.delete(`/threads/${thread.id}/${id}/vote`);
		}

		doRefresh();
	};

	const deleteThread = async () => {
		Alert.alert(
			"Confirmation",
			"Êtes-vous sûr(e) de vouloir supprimer ce sujet ?",
			[
				{
					text: "Oui",
					onPress: async () => {
						await axios.delete(`/threads/${thread.id}`);
						navigation.navigate("Threads");
					},
				},
				{
					text: "Non",
					style: "cancel",
				},
			],
			{ cancelable: true }
		);
	};

	const deletePost = async () => {
		Alert.alert(
			"Confirmation",
			"Êtes-vous sûr(e) de vouloir supprimer ce message ?",
			[
				{
					text: "Oui",
					onPress: async () => {
						await axios.delete(`/threads/${thread.id}/${id}`);
						doRefresh();
					},
				},
				{
					text: "Non",
					style: "cancel",
				},
			],
			{ cancelable: true }
		);
	};

	const toggleLock = async () => {
		await axios.post(`/threads/${thread.id}/${thread.closed ? "open" : "close"}`);
		doRefresh();
	};

	const editThread = async () => {
		navigation.navigate("EditThread", { ...thread, body });
	};
	const editPost = async () => {
		navigation.navigate("EditPost", { id, body, thread });
	};

	const setAnswer = async () => {
		if (thread.answerId != id) await axios.post(`/threads/${thread.id}/${id}/answer`);
		else await axios.delete(`/threads/${thread.id}/answer`);
		doRefresh();
	};

	return (
		<View>
			{firstPost && thread.tags.length > 0 ? (
				<View
					style={{
						paddingHorizontal: 12,
						paddingVertical: 6,
						borderBottomWidth: 1,
						borderColor: "#00000020",
						backgroundColor: "#0000000a",
					}}
				>
					<MyTags tags={thread.tags.map(({ name }) => name)} readonly />
				</View>
			) : null}
			<TouchableOpacity
				style={{
					padding: 12,
					backgroundColor:
						thread.answerId == id ? colors.greenTranslucent : colors.purpleTranslucent,
					borderTopWidth: 1,
					borderBottomWidth: 1,
					borderColor: "#00000020",
					flex: 1,
					flexDirection: "row",
					alignItems: "center",
				}}
				onPress={() => {
					navigation.navigate("Profile", { id: author.id });
				}}
			>
				<UserAvatar size="medium" user={author} containerStyle={{ marginRight: 12 }} />
				<View>
					<Text style={{ fontSize: 18, fontWeight: "bold" }}>{author.username}</Text>
					<Text style={{ fontSize: 12, color: "#000000a0" }}>
						{modified
							? `modifié ${moment(updatedAt).locale("fr").fromNow()}`
							: moment(createdAt).locale("fr").calendar().toLowerCase()}
					</Text>
				</View>
			</TouchableOpacity>
			<View>
				<MarkdownView style={{ margin: 12 }}>{body}</MarkdownView>
			</View>
			<View
				style={{
					paddingHorizontal: 12,
					paddingVertical: 6,
					flex: 1,
					flexDirection: "row",
					alignItems: "center",
					borderTopWidth: 1,
					borderColor: "#00000020",
					backgroundColor: "#0000000a",
				}}
			>
				<ActionButton align="l" onPress={() => vote(true)}>
					👍 {votes.filter(({ up }) => up).length}
				</ActionButton>
				<ActionButton align="l" onPress={() => vote(false)}>
					👎 {votes.filter(({ up }) => !up).length}
				</ActionButton>
				{state.token ? (
					<>
						{(!thread.closed || firstPost) && author.id == user.id ? (
							<ActionButton
								align="l"
								onPress={() => (firstPost ? editThread() : editPost())}
							>
								📝
							</ActionButton>
						) : null}
						{hasPermission ? (
							<>
								{!thread.closed || firstPost ? (
									<ActionButton
										align="l"
										onPress={() => (firstPost ? deleteThread() : deletePost())}
									>
										🗑
									</ActionButton>
								) : null}
								{firstPost ? (
									<ActionButton align="l" onPress={toggleLock}>
										{thread.closed ? "🔓" : "🔒"}
									</ActionButton>
								) : null}
							</>
						) : null}
						{!firstPost && thread.author.id == user.id ? (
							<ActionButton align="l" onPress={setAnswer}>
								✅
							</ActionButton>
						) : null}
					</>
				) : null}
			</View>
		</View>
	);
}
