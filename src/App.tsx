import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import LoginForm from "./components/LoginForm";

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		setIsAuthenticated(!!token);
	}, []);

	const handleLogin = () => {
		setIsAuthenticated(true);
	};

	return (
		<div className="p-4">
			{isAuthenticated ? (
				<Dashboard />
			) : (
				<LoginForm onLogin={handleLogin} />
			)}
		</div>
	);
}

export default App;
