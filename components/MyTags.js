import invert from "invert-color";
import React, { createRef } from "react";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Tags from "react-native-tags";
import stc from "string-to-color";

export default function MyTags(props) {
	const tagsRef = createRef();
	const { tags, tagContainerStyle, tagTextStyle, onChangeTags, readonly } = props;

	useEffect(() => {
		if (!tags) return;
		const text = tagsRef.current.state.text;
		tagsRef.current.setState({ tags, text });
	}, [tags]);

	return (
		<Tags
			ref={tagsRef}
			initialTags={tags}
			containerStyle={{ margin: 0, padding: 0 }}
			inputStyle={{
				flex: 1,
				fontSize: 16,
				padding: 0,
				borderWidth: 1,
				borderColor: "#0000007f",
				borderRadius: 2,
				paddingHorizontal: 0,
			}}
			inputContainerStyle={{
				margin: 0,
				backgroundColor: "transparent",
				padding: 0,
			}}
			renderTag={({ tag, index, onPress, deleteTagOnPress }) => {
				const color = stc(tag);
				const Container = !readonly ? TouchableOpacity : View;
				return (
					<Container
						key={`${tag}-${index}`}
						style={{
							borderRadius: 12,
							backgroundColor: color,
							paddingHorizontal: 8,
							paddingVertical: 4,
							marginRight: 4,
							marginVertical: 2,
							...(tagContainerStyle || {}),
						}}
						onPress={!readonly ? onPress : undefined}
					>
						<Text style={{ color: invert(color, true), ...(tagTextStyle || {}) }}>
							{tag}
						</Text>
					</Container>
				);
			}}
			textInputProps={{
				onBlur: () => {
					const text = tagsRef.current.state.text;
					if (text.trim().length < 1) return;
					if (tagsRef.current.state.tags.includes(text.trim())) return;
					tagsRef.current.addTag(text);
				},
			}}
			{...props}
			onChangeTags={tags => {
				const text = tagsRef.current.state.text;
				tags = tags.slice();
				for (const tag of tags.slice()) {
					if (/[^a-z0-9-]/.test(tag)) tags.splice(tags.indexOf(tag), 1);
				}
				tagsRef.current.setState({ tags, text });
				onChangeTags?.(tags);
			}}
		/>
	);
}
