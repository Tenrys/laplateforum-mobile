import axios from "axios";
import React from "react";
import { Avatar } from "react-native-elements";

export default function UserAvatar(props) {
	const { avatar } = props;

	const baseUrl = new URL(axios.defaults.baseURL).origin;

	return (
		<Avatar
			rounded
			size="xlarge"
			source={{
				uri: `${baseUrl}/uploads/${avatar}`,
			}}
			{...props}
		/>
	);
}
