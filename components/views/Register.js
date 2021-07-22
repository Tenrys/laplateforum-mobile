import React, { useState, useContext, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import { StoreContext } from "../../store/StoreContext";
import common, { colors } from "../../styles";

const login = StyleSheet.create({
	container: {
		paddingHorizontal: "5%",
		paddingVertical: 32,
		width: "100%",
		height: "100%",
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

export default function Login() {
	const { register } = useContext(StoreContext);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordCheck, setPasswordCheck] = useState(false);
	const [passwordConfirm, setPasswordConfirm] = useState(true);
	const [registering, setRegistering] = useState(false);
	const [error, setError] = useState(null);

	const doRegister = async () => {
		setRegistering(true);
		try {
			await register(username, password);
			setError(null);
		} catch (err) {
			setError(err.message);
		}
		setRegistering(false);
	};

	return (
		<ScrollView contentContainerStyle={common.container}>
			{!registering ? (
				<View style={login.container}>
					{error ? <Text style={[{ color: "red" }, login.spacing]}>{error}</Text> : null}
					<Text style={[login.fieldName, login.spacing]}>Nom d&#39;utilisateur</Text>
					<TextInput
						style={[login.input, login.spacing]}
						defaultValue={username}
						onChangeText={setUsername}
					/>
					<Text style={[login.fieldName, login.spacing]}>Mot de passe</Text>
					<TextInput
						style={[login.input, login.spacing]}
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
					<Text style={[login.fieldName, login.spacing]}>
						Confirmation du mot de passe
					</Text>
					<TextInput
						style={[login.input, login.spacing]}
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
					<Button onPress={doRegister} title="Inscription" color={colors.purple} />
				</View>
			) : (
				<ActivityIndicator size="large" color={colors.purple} />
			)}
		</ScrollView>
	);
}
