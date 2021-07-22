import axios from "axios";

export function UserReducer(prevState, { type, data }) {
	switch (type) {
		case "REGISTER":
			return {
				...prevState,
			};
		case "RESTORE_TOKEN":
			return {
				...prevState,
				token: data.token,
				isLoading: false,
			};
		case "SIGN_IN":
			axios.defaults.headers.common["Authorization"] = "Bearer " + data.token;
			return {
				...prevState,
				user: data.user,
				token: data.token,
			};
		case "SIGN_OUT":
			delete axios.defaults.headers.common["Authorization"];
			return {
				...prevState,
				user: null,
				token: null,
			};
		case "UPDATE_USER":
			return {
				...prevState,
				user: {
					...prevState.user,
					...data.user,
				},
			};
	}
}
