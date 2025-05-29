import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { type Application } from "../types/Application";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("token");

interface Props {
	application: Application;
	onClose: () => void;
	onUpdate: (updated: Application) => void;
}

export default function EditApplicationModal({
	application,
	onClose,
	onUpdate,
}: Props) {
	const [formData, setFormData] = useState<Application>({
		company: "",
		position: "",
		appliedDate: "",
		status: "Applied",
		notes: "",
	});

	useEffect(() => {
		setFormData(application);
	}, [application]);

	function handleChange<
		T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
	>(event: ChangeEvent<T>): void {
		if (event.target) {
			const { name, value } = event.target;
			if (formData) {
				setFormData({ ...formData, [name]: value });
			}
		}
	}

	async function handleSubmit(event: FormEvent): Promise<void> {
		event.preventDefault();
		if (!formData) return;

		const response = await fetch(
			`${API_BASE_URL}/applications/${formData.id}`,
			{
				method: "PUT",
				mode: "cors",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(formData),
			},
		);

		if (response.ok) {
			onUpdate(formData);
			onClose();
		} else {
			alert("Failed to update.");
		}
	}

	function getDate(appliedDate: string): string {
		const formattedDate = appliedDate.split("T");
		return formattedDate[0];
	}

	return (
		<div className="bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center bg-black">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<h2 className="mb-4 text-xl font-bold">Edit Application</h2>
				<form className="space-y-4">
					<input
						className="w-full rounded border p-2"
						name="company"
						value={formData.company}
						onChange={handleChange}
						placeholder="Company"
					/>
					<input
						className="w-full rounded border p-2"
						name="position"
						value={formData.position}
						onChange={handleChange}
						placeholder="Position"
					/>
					<input
						className="w-full rounded border p-2"
						name="appliedDate"
						type="date"
						value={getDate(formData.appliedDate)}
						onChange={handleChange}
					/>
					<select
						className="w-full rounded border p-2"
						name="status"
						value={formData.status}
						onChange={handleChange}
					>
						<option>Applied</option>
						<option>Interviewing</option>
						<option>Offer</option>
						<option>Rejected</option>
					</select>
					<textarea
						className="w-full rounded border p-2"
						name="notes"
						value={formData.notes}
						onChange={handleChange}
						placeholder="Notes"
					/>
					<div className="flex justify-end space-x-2">
						<button
							type="button"
							onClick={onClose}
							className="rounded bg-gray-300 px-4 py-2"
						>
							Cancel
						</button>
						<button
							type="submit"
							onClick={handleSubmit}
							className="rounded bg-blue-600 px-4 py-2 text-white"
						>
							Update
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
