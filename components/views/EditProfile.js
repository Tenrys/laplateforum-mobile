import axios from "axios";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import React, { useContext, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, ToastAndroid } from "react-native";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { StoreContext } from "../../store/StoreContext";
import common, { colors } from "../../styles";
import UserAvatar from "../UserAvatar";

const profile = StyleSheet.create({
	container: {
		paddingHorizontal: "5%",
		paddingVertical: 32,
	},
	header: {
		fontSize: 24,
		marginBottom: 16,
	},
	fieldName: {
		fontSize: 18,
	},
	input: {
		width: "100%",
		fontSize: 16,
		padding: 4,
		borderWidth: 1,
		borderColor: "#0000007f",
		borderRadius: 2,
	},
	spacing: {
		marginBottom: 8,
	},
});

export default function EditProfile({ navigation }) {
	const { state, dispatch } = useContext(StoreContext);
	const { user } = state;
	const [status, setStatus] = useState(user.status);
	const [website, setWebsite] = useState(user.website);
	const [twitter, setTwitter] = useState(user.twitter);
	const [avatar, setAvatar] = useState(null);
	const [password, setPassword] = useState(null);
	const [passwordCheck, setPasswordCheck] = useState(false);
	const [passwordConfirm, setPasswordConfirm] = useState(true);

	async function saveChanges() {
		try {
			const body = new FormData();
			if (avatar) {
				const filename = avatar.split("/").pop();

				// Infer the type of the image
				const match = /\.(\w+)$/.exec(filename);
				const type = match ? `image/${match[1]}` : `image`;

				body.append("avatar", { uri: avatar, name: filename, type });
			}
			if (status) body.append("status", status);
			if (website) body.append("website", website);
			if (twitter) body.append("twitter", twitter);
			if (password) body.append("password", password);

			const { data } = await axios.post("/users/me", body);
			dispatch({ type: "UPDATE_USER", data: { user: data.result } });

			ToastAndroid.show("Profil mis à jour !", ToastAndroid.LONG);
		} catch (err) {
			console.error(err);
			console.log(err.response.data);
		}
	}

	const pickAvatar = async () => {
		const { cancelled, uri } = await launchImageLibraryAsync({
			mediaTypes: [MediaTypeOptions.Images],
			aspect: [1, 1],
			allowsEditing: true,
		});

		if (!cancelled) {
			setAvatar(uri);
		}
	};

	return (
		<ScrollView contentContainerStyle={[profile.container, common.container]}>
			{avatar ? (
				<Avatar rounded size="xlarge" source={{ uri: avatar }} onPress={pickAvatar} />
			) : (
				<UserAvatar user={user} onPress={pickAvatar} />
			)}
			<Text style={[profile.header, profile.spacing]}>{user.username}</Text>
			<Text style={[profile.fieldName, profile.spacing]}>Statut</Text>
			<TextInput
				style={[profile.input, profile.spacing]}
				minLength={1}
				maxLength={32}
				onChangeText={setStatus}
				defaultValue={status}
			/>
			<Text style={[profile.fieldName, profile.spacing]}>Site perso</Text>
			<TextInput
				style={[profile.input, profile.spacing]}
				onChangeText={setWebsite}
				defaultValue={website}
			/>
			<Text style={[profile.fieldName, profile.spacing]}>Twitter (@)</Text>
			<TextInput
				style={[profile.input, profile.spacing]}
				maxLength={15}
				onChangeText={setTwitter}
				defaultValue={twitter}
			/>
			<Text style={[profile.fieldName, profile.spacing]}>Mot de passe</Text>
			<TextInput
				style={[profile.input, profile.spacing]}
				secureTextEntry={true}
				minLength={8}
				maxLength={128}
				onChangeText={password => {
					setPassword(password);
					if (password.length > 0) {
						setPasswordCheck(true);
					} else {
						setPasswordCheck(false);
					}
				}}
			/>
			{passwordCheck ? (
				<>
					<Text style={[profile.fieldName, profile.spacing]}>
						Confirmation du mot de passe
					</Text>
					<TextInput
						style={[profile.input, profile.spacing]}
						secureTextEntry={true}
						minLength={8}
						maxLength={128}
						onChangeText={confirm => {
							if (confirm == password) {
								setPasswordConfirm(true);
							} else {
								setPasswordConfirm(false);
							}
						}}
					/>
				</>
			) : null}
			<Button
				title="Modifier"
				disabled={passwordCheck && !passwordConfirm}
				onPress={saveChanges}
				color={colors.purple}
			/>
		</ScrollView>
	);
}
