import moment from "moment";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";
import { colors } from "../styles";
import UserAvatar from "./UserAvatar";

export default function Thread(props) {
	const { title, author, createdAt, updatedAt } = props;

	const modified = createdAt !== updatedAt;

	return (
		<TouchableOpacity {...props}>
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
					<Text style={{ fontSize: 18, fontWeight: "bold" }}>{title}</Text>
					<Text style={{ fontSize: 12, color: "#000000a0" }}>
						par {author.username},{" "}
						{modified
							? `modifié ${moment(updatedAt).locale("fr").fromNow()}`
							: moment(createdAt).locale("fr").calendar().toLowerCase()}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}
