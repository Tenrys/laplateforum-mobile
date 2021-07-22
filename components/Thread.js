import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";
import { colors } from "../styles";
import MyTags from "./MyTags";
import UserAvatar from "./UserAvatar";

export default function Thread(props) {
	const navigation = useNavigation();
	const {
		title,
		author,
		tags,
		closed,
		links,
		posts,
		participantCount,
		answerId,
		createdAt,
		updatedAt,
	} = props;

	const modified = createdAt !== updatedAt;

	return (
		<TouchableOpacity {...props}>
			<View
				style={{
					padding: 12,
					backgroundColor: answerId ? colors.greenTranslucent : colors.purpleTranslucent,
					opacity: closed ? 0.66 : 1,
					borderTopWidth: 1,
					borderBottomWidth: 1,
					borderColor: "#00000020",
					flex: 1,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<View
					style={{
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<UserAvatar
						size="medium"
						user={author}
						containerStyle={{ marginRight: 12 }}
						onPress={() => {
							navigation.navigate("Profile", { id: author.id });
						}}
					/>
					<View>
						<Text style={{ fontSize: 18, fontWeight: "bold" }}>{title}</Text>
						<Text style={{ fontSize: 12, color: "#000000a0" }}>
							par {author.username},{" "}
							{modified
								? `modifié ${moment(updatedAt).locale("fr").fromNow()}`
								: moment(createdAt).locale("fr").calendar().toLowerCase()}
						</Text>
						<MyTags
							tags={tags.map(({ name }) => name)}
							readonly
							tagContainerStyle={{
								paddingVertical: 2,
								paddingHorizontal: 4,
								marginRight: 2,
							}}
							tagTextStyle={{ fontSize: 10 }}
						/>
					</View>
				</View>
				<View
					style={{
						flex: 1,
						alignItems: "flex-end",
					}}
				>
					<Text>💬 {posts.length}</Text>
					<Text>👤 {participantCount}</Text>
					<Text>🔗 {links.length}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}
