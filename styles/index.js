import { StyleSheet } from "react-native";

export const colors = {
	purple: "#9D61D6",
	purpleTranslucent: "#9D61D620",
	orange: "#ed8b36",
	blue: "#35aade",
	blueTranslucent: "#35aade20",
};

export default StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	containerCenterTop: {
		flexGrow: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "flex-start",
	},
	input: {
		color: "black",
		height: 25,
		width: 100,
		margin: 2,
		padding: 3,
		borderWidth: 1,
		borderRadius: 5,
	},
	inputFalse: {
		color: "red",
		height: 25,
		width: 100,
		margin: 2,
		padding: 3,
		borderWidth: 1,
		borderRadius: 5,
	},
});
