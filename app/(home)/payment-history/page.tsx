import { Metadata } from "next";
import PageContainer from "../page-container";

export const metadata: Metadata = {
	title: "Payment History"
};
export default function Page() {
	return (
		<PageContainer heading={[{ label: "Payment History" }]}>
			<div></div>
		</PageContainer>
	);
}
