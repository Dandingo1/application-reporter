import { useState, type ChangeEvent, type FormEvent } from "react";
import { type Application } from "../types/Application";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("token");

interface ApplicationFormProps {
	onAdd: (newApp: Application) => void;
}

export default function ApplicationForm({ onAdd }: ApplicationFormProps) {
	const [formData, setFormData] = useState({
		company: "",
		position: "",
		appliedDate: "",
		status: "Applied",
		notes: "",
	});

	async function handleChange<
		T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
	>(event: ChangeEvent<T>): Promise<void> {
		if (event.target) {
			const { name, value } = event.target;
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	}

	async function handleSubmit(
		event: FormEvent<HTMLFormElement>,
	): Promise<void> {
		event.preventDefault();

		const response = await fetch(`${API_BASE_URL}/applications`, {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(formData),
		});

		if (response.ok) {
			const newApp = await response.json();
			onAdd(newApp); // Let parent component update the list
			setFormData({
				company: "",
				position: "",
				appliedDate: "",
				status: "Applied",
				notes: "",
			});
		} else {
			alert("Failed to add application.");
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 rounded-md border p-4"
		>
			<div className="flex">
				<div className="mr-4 flex w-1/2 flex-col">
					<label>Company:</label>
					<input
						name="company"
						className="rounded border py-0.5"
						value={formData.company}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="flex w-1/2 flex-col">
					<label>Position:</label>
					<input
						name="position"
						className="rounded border py-0.5"
						value={formData.position}
						onChange={handleChange}
						required
					/>
				</div>
			</div>
			<div className="flex">
				<div className="mr-4 flex w-1/2 flex-col">
					<label>Status:</label>
					<select
						name="status"
						className="rounded border py-0.5 text-lg"
						value={formData.status}
						onChange={handleChange}
					>
						<option>Applied</option>
						<option>Interview</option>
						<option>Offer</option>
						<option>Rejected</option>
					</select>
				</div>
				<div className="flex w-1/2 flex-col">
					<label>Applied Date:</label>
					<input
						type="date"
						name="appliedDate"
						className="rounded border py-0.5 text-base"
						value={formData.appliedDate}
						onChange={handleChange}
						required
					/>
				</div>
			</div>
			<div className="flex flex-col">
				<label>Notes:</label>
				<textarea
					name="notes"
					className="flex w-full rounded border bg-gray-100"
					value={formData.notes}
					onChange={handleChange}
				></textarea>
			</div>
			<button
				type="submit"
				className="rounded bg-gray-500 px-3 py-2 text-white"
			>
				Add Application
			</button>
		</form>
	);
}
