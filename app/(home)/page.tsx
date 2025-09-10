import { Metadata } from "next";
import PageContainer from "./page-container";

export const metadata: Metadata = {
	title: "Welcome to BSC Generator"
};
export default async function Page() {
	return (
		<PageContainer heading={[{ label: "Home", url: "/" }]}>
			Has registeredffffffffffffffffffffffffffffffffffffffffffffffffff
		</PageContainer>
	);
}
