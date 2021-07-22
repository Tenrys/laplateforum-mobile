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

export default function EditThread({ route, navigation }) {
	const { id } = route.params;
	const [title, setTitle] = useState(route.params.title);
	const [tags, setTags] = useState(route.params.tags.map(({ name }) => name));
	const [body, setBody] = useState(route.params.body);
	const [error, setError] = useState(null);
	const [sending, setSending] = useState(false);

	async function editThread() {
		setSending(true);
		try {
			await axios.put(`/threads/${id}`, {
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
				defaultValue={title}
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
				defaultValue={body}
				multiline
				placeholder="Contenu du sujet..."
				minLength={8}
			/>
			<Button
				title={sending ? "Modification..." : "Modifier"}
				onPress={editThread}
				disabled={!sending && (title.length < 8 || body.length < 8)}
				color={colors.purple}
			/>
		</ScrollView>
	);
}
