import prisma from "@/lib/prisma";
import PeerReviewsClient from "./peer-review-client";

export default async function PeerReviews() {
	const peerReviews = await prisma.peerReview.findMany({ include: { user: true } });
	if (!peerReviews.length) return null;
	return (
		<div className="bg-gradient-to-r from-primary dark:from-primary/10 py-12 space-y-4 sm:py-16 text-white to-cyan-500 dark:to-cyan-500/10">
			<h1 className="text-xl md:text-2xl lg:text-3xl text-center uppercase  tracking-tight">What People have to say</h1>
			<PeerReviewsClient peerReviews={peerReviews} />
		</div>
	);
}
