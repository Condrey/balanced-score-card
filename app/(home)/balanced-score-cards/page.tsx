import { Metadata } from "next";
import PageContainer from "../page-container";

export const metadata: Metadata = {
	title: "Balanced Score Cards"
};
export default function Page() {
	return (
		<PageContainer heading={[{ label: "Balanced Score Cards" }]}>
			<div></div>
		</PageContainer>
	);
}
