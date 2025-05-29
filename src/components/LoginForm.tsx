import { useState } from "react";

type Props = {
	onLogin: () => void;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginForm({ onLogin }: Props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			const response = await fetch(`${API_BASE_URL}/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				setError("Invalid credentials");
				return;
			}

			const data = await response.json();
			localStorage.setItem("token", data.token); // 🔐 store the JWT
			onLogin(); // 🔁 trigger refresh in parent
		} catch (err) {
			console.error(err);
			setError("Login failed");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="mx-auto max-w-md space-y-4 rounded border bg-white p-4 shadow"
		>
			<h2 className="text-xl font-bold">Login</h2>
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				className="w-full rounded border p-2"
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				className="w-full rounded border p-2"
			/>
			{error && <p className="text-red-500">{error}</p>}
			<button
				type="submit"
				className="w-full rounded bg-blue-600 p-2 text-white"
			>
				Log In
			</button>
		</form>
	);
}
