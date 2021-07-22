import axios from "axios";
import React, { useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { MarkdownView } from "react-native-markdown-view";
import { colors } from "../../styles";

export default function EditPost({ route, navigation }) {
	const { id, thread } = route.params;
	const [body, setBody] = useState(route.params.body);
	const [error, setError] = useState(null);
	const [sending, setSending] = useState(false);

	async function editPost() {
		setSending(true);
		try {
			await axios.put(`/threads/${thread.id}/${id}`, {
				body,
			});
			navigation.navigate("Thread", { id });
			setBody("");
		} catch (err) {
			console.error(err);
			setError(err.message);
		}
		setSending(false);
	}

	return (
		<ScrollView style={{ padding: 12 }}>
			{error ? <Text style={{ color: "red" }}>{error}</Text> : null}
			<Text>Prévisualisation:</Text>
			<MarkdownView style={{ marginBottom: 12 }}>{body}</MarkdownView>
			<TextInput
				style={{
					flex: 1,
					fontSize: 16,
					padding: 4,
					borderWidth: 1,
					borderColor: "#0000007f",
					borderRadius: 2,
				}}
				defaultValue={body}
				onChangeText={setBody}
				multiline
				placeholder="Envoyer une réponse..."
			/>
			<Button
				title={sending ? "Modification..." : "Modifier"}
				onPress={editPost}
				disabled={!sending && body.length < 8}
				color={colors.purple}
			/>
		</ScrollView>
	);
}
