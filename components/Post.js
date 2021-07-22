import React, { useContext } from "react";
import { Button, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import UserAvatar from "./UserAvatar";
import { colors } from "../styles";
import moment from "moment";
import { MarkdownView } from "react-native-markdown-view";
import { StoreContext } from "../store/StoreContext";
import axios from "axios";

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
	const { state } = useContext(StoreContext);
	const { user } = state;
	const { id, body, author, thread, votes, createdAt, updatedAt, doRefresh } = props;

	const modified = createdAt !== updatedAt;
	const hasPermission = user && (author.id == user.id || user.role.isAdmin);

	const vote = async up => {
		if (!user) {
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

	return (
		<View>
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
					size="medium"
					avatar={author.avatar}
					containerStyle={{ marginRight: 12 }}
				/>
				<View>
					<Text style={{ fontSize: 18, fontWeight: "bold" }}>{author.username}</Text>
					<Text style={{ fontSize: 12, color: "#000000a0" }}>
						{modified
							? `modifié ${moment(updatedAt).locale("fr").fromNow()}`
							: moment(createdAt).locale("fr").calendar().toLowerCase()}
					</Text>
				</View>
			</View>
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
					justifyContent: "space-between",
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
				<View
					style={{
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "flex-end",
					}}
				>
					{state.token ? (
						<>
							{author.id == user.id ? (
								<ActionButton align="r">📝</ActionButton>
							) : null}
							{hasPermission ? <ActionButton align="r">🗑</ActionButton> : null}
							{thread.author.id == user.id ? (
								<ActionButton align="r">✅</ActionButton>
							) : null}
						</>
					) : null}
				</View>
			</View>
		</View>
	);
}
