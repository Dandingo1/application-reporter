import { useEffect, useState } from "react";
import { getApplications } from "../services/ApplicationService";
import { type Application } from "../types/Application";
import ApplicationForm from "../components/ApplicationForm";
import EditApplicationModal from "../components/EditApplicationModal";
import { useDebounce } from "../hooks/UseDebounce";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("token");

const Dashboard = () => {
	const [applications, setApplications] = useState<Application[]>([]);
	const [editingApp, setEditingApp] = useState<Application | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [showApplicationForm, setApplicationForm] = useState<boolean>(false);
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const filteredApplications = applications.filter((app) => {
		const matchesSearch =
			app.company
				.toLowerCase()
				.includes(debouncedSearchQuery.toLowerCase()) ||
			app.position
				.toLowerCase()
				.includes(debouncedSearchQuery.toLowerCase());

		const matchesStatus =
			statusFilter === "All" || app.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	useEffect(() => {
		getApplications().then(setApplications);
	}, []);

	function handleAdd(newApp: Application): void {
		setApplications((prev) => [...prev, newApp]);
	}

	async function handleDelete(id: number): Promise<void> {
		const confirmed = window.confirm(
			"Are you sure you want to delete this application?",
		);
		if (!confirmed) return;

		const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
			method: "DELETE",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.ok) {
			setApplications((prev) => prev.filter((app) => app.id !== id));
		} else {
			alert("Failed to delete the application.");
		}
	}

	const total = applications.length;
	const applied = applications.filter(
		(app) => app.status === "Applied",
	).length;
	const interviewing = applications.filter(
		(app) => app.status === "Interviewing",
	).length;
	const offer = applications.filter((app) => app.status === "Offer").length;
	const rejected = applications.filter(
		(app) => app.status === "Rejected",
	).length;

	return (
		<div className="w-full space-y-6 rounded-lg p-6 shadow-lg">
			<h1 className="mb-4 text-2xl font-bold">Job Applications</h1>
			<div className="mb-6 grid grid-cols-2 gap-4 text-center md:grid-cols-5">
				<div className="rounded bg-white p-4 shadow">
					<p className="text-sm text-gray-500">Total</p>
					<p className="text-xl font-bold">{total}</p>
				</div>
				<div className="rounded bg-blue-100 p-4">
					<p className="text-sm text-blue-600">Applied</p>
					<p className="text-lg font-semibold">{applied}</p>
				</div>
				<div className="rounded bg-yellow-100 p-4">
					<p className="text-sm text-yellow-600">Interviewing</p>
					<p className="text-lg font-semibold">{interviewing}</p>
				</div>
				<div className="rounded bg-green-100 p-4">
					<p className="text-sm text-green-600">Offer</p>
					<p className="text-lg font-semibold">{offer}</p>
				</div>
				<div className="rounded bg-red-100 p-4">
					<p className="text-sm text-red-600">Rejected</p>
					<p className="text-lg font-semibold">{rejected}</p>
				</div>
			</div>
			<div className="mb-4">
				{showApplicationForm && <ApplicationForm onAdd={handleAdd} />}
			</div>
			<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
				<input
					type="text"
					placeholder="Search by company or position..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full rounded border p-2 text-sm md:w-2/4"
				/>
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className="text-m w-full rounded border p-2 md:w-1/4"
				>
					<option value="All">All Statuses</option>
					<option value="Applied">Applied</option>
					<option value="Interviewing">Interviewing</option>
					<option value="Offer">Offer</option>
					<option value="Rejected">Rejected</option>
				</select>
				<button
					onClick={() => setApplicationForm(!showApplicationForm)}
					className="rounded bg-cyan-700 p-2 text-white hover:bg-cyan-800 md:w-1/4"
				>
					{!showApplicationForm
						? "+ New Application"
						: "- Close Application"}
				</button>
			</div>

			<ul className="space-y-4">
				{filteredApplications.map((app) => (
					<li
						key={app.id}
						className="flex flex-col items-center justify-between rounded border bg-white p-4 shadow-sm"
					>
						<div className="flex w-full flex-row justify-between">
							<div className="space flex flex-col">
								<h2 className="text-xl font-semibold text-gray-600">
									{app.position} @ {app.company}
								</h2>
								<p className="text-gray-600">
									Status: {app.status}
								</p>
								<p className="text-gray-600">
									Applied:{" "}
									{new Date(
										app.appliedDate,
									).toLocaleDateString()}
								</p>
							</div>
							<div className="mt-4 flex-shrink-0 flex-row space-x-2 md:mt-0 md:ml-4">
								<button
									className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
									onClick={() => setEditingApp(app)}
								>
									Edit
								</button>
								<button
									className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
									onClick={() => handleDelete(app.id!)}
								>
									Delete
								</button>
							</div>
						</div>
						<div className="flex w-full">
							{app.notes && (
								<p className="mt-2 text-sm wrap-anywhere whitespace-break-spaces text-gray-700">
									<span className="font-medium text-gray-500">
										Notes:{" "}
									</span>
									{app.notes}
								</p>
							)}
						</div>
					</li>
				))}
			</ul>
			{filteredApplications.length === 0 && (
				<p className="mt-4 text-center text-gray-500">
					No applications found.
				</p>
			)}
			{editingApp && (
				<EditApplicationModal
					application={editingApp}
					onClose={() => setEditingApp(null)}
					onUpdate={(updated) => {
						setApplications((prev) =>
							prev.map((app) =>
								app.id === updated.id ? updated : app,
							),
						);
					}}
				/>
			)}
		</div>
	);
};

export default Dashboard;
