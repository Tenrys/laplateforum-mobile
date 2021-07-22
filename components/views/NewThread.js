import axios from "axios";
import React, { useState } from "react";
import { Button, ScrollView, Text, TextInput } from "react-native";
import { MarkdownView } from "react-native-markdown-view";
import { colors } from "../../styles";
import MyTags from "../MyTags";

const inputStyle = {
	flex: 1,
	fontSize: 16,
	padding: 4,
	borderWidth: 1,
	borderColor: "#0000007f",
	borderRadius: 2,
};

export default function NewThread({ route, navigation }) {
	const [title, setTitle] = useState("");
	const [tags, setTags] = useState([]);
	const [body, setBody] = useState("");
	const [error, setError] = useState(null);
	const [sending, setSending] = useState(false);

	async function sendThread() {
		setSending(true);
		try {
			const {
				data: {
					result: { id },
				},
			} = await axios.post(`/threads`, {
				title,
				tags,
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
			<TextInput
				style={inputStyle}
				onChangeText={setTitle}
				placeholder="Nom du sujet..."
				minLength={8}
			/>
			<Text>Tags:</Text>
			<MyTags tags={tags} onChangeTags={setTags}></MyTags>
			<Text>Prévisualisation:</Text>
			<MarkdownView style={{ marginBottom: 12 }}>{body}</MarkdownView>
			<TextInput
				style={inputStyle}
				onChangeText={setBody}
				multiline
				placeholder="Contenu du sujet..."
				minLength={8}
			/>
			<Button
				title={sending ? "Envoi..." : "Envoyer"}
				onPress={sendThread}
				disabled={!sending && (title.length < 8 || body.length < 8)}
				color={colors.purple}
			/>
		</ScrollView>
	);
}
