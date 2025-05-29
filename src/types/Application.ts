export type ApplicationStatus =
	| "Applied"
	| "Interviewing"
	| "Offer"
	| "Rejected";

export type Application = {
	id?: number;
	company: string;
	position: string;
	appliedDate: string;
	status: ApplicationStatus;
	notes: string;
};
