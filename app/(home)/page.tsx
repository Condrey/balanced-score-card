import SignIn from "@/components/sign-in";
import { MoveRightIcon } from "lucide-react";
import DescriptionOfBsc from "./description-of-bsc";
import Footer from "./footer";
import PeerReviews from "./peer-reviews";
import ReasonForBsc from "./reason-for-bsc";
import UsageStatistics from "./usage-statistics";
import WebFunctions from "./web-functions";
import WebPackages from "./web-packages";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
	return (
		<div className=" flex min-h-dvh flex-col">
			{/* content  */}
			<section className="mx-auto w-full *:w-full *:mx-auto max-w-5xl flex-1 space-y-12 p-4">
				{/* sign in button  */}
				<div className="flex justify-end">
					<SignIn className="text-xl">Generate My BSC</SignIn>
				</div>
				<DescriptionOfBsc />
				<ReasonForBsc />
				<WebFunctions />
				{/* sign in button  */}
				<div className="flex gap-3 items-center justify-end">
					<p>What are you waiting for?</p>{" "}
					<SignIn variant={"secondary"}>
						Get started <MoveRightIcon />
					</SignIn>
				</div>
				{/* stats  */}
			</section>
			<section>
				<Suspense fallback={<Skeleton className="h-[200px] w-full"/>}>
          <PeerReviews />
        </Suspense>
				<UsageStatistics />
				<WebPackages />
			</section>
			{/* Footer  */}
			<Footer />
		</div>
	);
}
