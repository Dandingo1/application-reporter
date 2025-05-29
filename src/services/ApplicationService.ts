import { type Application } from "../types/Application";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("token");

export async function getApplications(): Promise<Application[]> {
	const response = await fetch(`${API_BASE_URL}/applications`, {
		method: "GET",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

	const text = await response.text();
	return text ? JSON.parse(text) : [];
}

export async function addApplication(application: Application): Promise<void> {
	const response = await fetch(`${API_BASE_URL}/applications`, {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(application),
	});
	return response.json();
}

export async function deleteApplication(): Promise<void> {
	const response = await fetch(`${API_BASE_URL}/applications`, {
		method: "DELETE",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	return response.json();
}

export async function updateApplication(
	application: Application,
): Promise<Application> {
	const response = await fetch(`${API_BASE_URL}/applications`, {
		method: "PUT",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(application),
	});

	return response.json();
}
