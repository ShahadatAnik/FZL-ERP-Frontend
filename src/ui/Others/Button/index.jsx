import { ArrowBack, PDF, TransferIn } from "@/assets/icons";
import BadgeCheckbox from "./BadgeCheckbox";
import { EditDelete } from "./EditDelete";
import StatusButton from "./StatusButton";

const ResetPassword = ({ onClick }) => {
	return (
		<button
			type="button"
			className="btn btn-circle btn-accent btn-xs font-semibold"
			onClick={onClick}
		>
			<ArrowBack className="w-4" />
		</button>
	);
};

function Pdf({ props }) {
	return (
		<button
			className="btn btn-xs rounded-full bg-secondary text-secondary-content"
			{...props}
		>
			PDF
			<PDF className="h-4 w-4" />
		</button>
	);
}

const Transfer = ({ onClick }) => {
	return (
		<button
			type="button"
			className="btn btn-circle btn-sm bg-primary font-semibold text-white shadow-md"
			onClick={onClick}
		>
			<TransferIn className="w-4" />
		</button>
	);
};

export {
	BadgeCheckbox,
	EditDelete,
	Pdf,
	ResetPassword,
	StatusButton,
	Transfer,
};
