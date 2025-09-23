import SignIn from "@/components/sign-in";
import { Skeleton } from "@/components/ui/skeleton";
import { MoveRightIcon } from "lucide-react";
import { Suspense } from "react";
import Footer from "../(home)/footer";
import DescriptionOfBsc from "./description-of-bsc";
import PeerReviews from "./peer-reviews";
import ReasonForBsc from "./reason-for-bsc";
import UsageStatistics from "./usage-statistics";
import WebFunctions from "./web-functions";
import WebPackages from "./web-packages";

export default function Page() {
	return (
		<div className=" flex min-h-dvh flex-col ">
			{/* content  */}
			<section className="mx-auto w-full *:w-full *:mx-auto max-w-5xl flex-1 space-y-12 p-4">
				{/* sign in button  */}
				<div className="flex justify-end">
					<SignIn className="text-xl capitalize">Log in now</SignIn>
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
			</section>
			<section className=" w-full *:w-full *:mx-auto  flex-1 space-y-12 pb-12">
				<Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
					<PeerReviews />
				</Suspense>
				<div className="px-4 w-full *:w-full *:mx-auto  flex-1 space-y-12">
					{/* stats  */}
					<Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
						<UsageStatistics />
					</Suspense>
					<WebPackages />
					{/* sign in button  */}
					<div className="flex gap-3 w-full mx-auto max-w-5xl items-center justify-end">
						<p>Start generating my BSC</p>{" "}
						<SignIn variant={"default"}>
							Start now <MoveRightIcon />
						</SignIn>
					</div>
				</div>
			</section>
			{/* Footer  */}
			<Footer />
		</div>
	);
}
