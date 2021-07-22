import axios from "axios";
import React, { useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { MarkdownView } from "react-native-markdown-view";
import { colors } from "../../styles";

export default function NewPost({ route, navigation }) {
	const { id } = route.params;
	const [body, setBody] = useState("");
	const [error, setError] = useState(null);
	const [sending, setSending] = useState(false);

	async function sendPost() {
		setSending(true);
		try {
			await axios.post(`/threads/${id}`, {
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
				onChangeText={setBody}
				multiline
				placeholder="Envoyer une réponse..."
			/>
			<Button
				title={sending ? "Envoi..." : "Envoyer"}
				onPress={sendPost}
				disabled={!sending && body.length < 8}
				color={colors.purple}
			/>
		</ScrollView>
	);
}
