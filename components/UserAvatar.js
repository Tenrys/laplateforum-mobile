import axios from "axios";
import React, { useContext } from "react";
import { Avatar } from "react-native-elements";
import { StoreContext } from "../store/StoreContext";
import { colors } from "../styles";

export default function UserAvatar(props) {
	const {
		state: { online },
	} = useContext(StoreContext);
	const { user } = props;
	const { id, avatar } = user;
	const baseUrl = new URL(axios.defaults.baseURL).origin;
	const isOnline = online && online.includes(id);

	return (
		<Avatar
			rounded
			size="xlarge"
			source={{
				uri: avatar
					? `${baseUrl}/uploads/${avatar}`
					: `${baseUrl}/assets/default-avatar.png`,
			}}
			{...props}
		>
			{isOnline ? (
				<Avatar.Accessory
					style={{
						backgroundColor: colors.green,
						position: "absolute",
						borderRadius: 100,
						bottom: 0,
						right: 0,
					}}
					size={16}
					Component={() => <></>} // Hide icon
				/>
			) : null}
		</Avatar>
	);
}
