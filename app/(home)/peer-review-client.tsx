"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { PeerReviewData } from "@/lib/types";
import Autoplay from "embla-carousel-autoplay";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export default function PeerReviewsClient({ peerReviews }: { peerReviews: PeerReviewData[] }) {
	const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: false, playOnInit: true }));
	return (
		<div className="max-w-7xl w-full mx-auto">
			<Carousel
				plugins={[plugin.current]}
				onMouseEnter={plugin.current.stop}
				onMouseLeave={plugin.current.reset}
				className="w-full"
			>
				<CarouselContent className="-ml-4">
					{[...peerReviews,/* ...peerReviews, ...peerReviews, ...peerReviews*/].map((peerReview, index) => {
						const {
							id,
							rating,
							review,
							user: { email, image, name }
						} = peerReview;
						return (
							<CarouselItem key={id + index} className="lg:basis-1/3 md:basis-2 pl-4">
								<Card className="bg-white/10 border-0  text-inherit p-4 rounded-md backdrop-blur-xl flex flex-col md:flex-row gap-2">
									<div className=" flex-none flex justify-center items-center">
										<Image
											src={image!}
											alt="user image"
											height={250}
											width={250}
											className="size-[95px] rounded-full"
										/>
									</div>
									<div className="">
										<CardTitle className="text-primary  text-lg uppercase  line-clamp-1 text-ellipsis ">
											{name}
										</CardTitle>
										<p className="text-xs text-primary">{email}</p>
										<p className="line-clamp-4 text-sm my-3 text-ellipsis leading-tight ">{review}</p>
										<div className="flex items-center  text-xs gap-3">
											<span>Ratings: {rating}/5</span>{" "}
											<div className="flex">
												{Array.from({ length: rating }, (_, i) => (
													<StarIcon key={i} className="fill-amber-300 size-4" />
												))}
											</div>
										</div>
									</div>
								</Card>
							</CarouselItem>
						);
					})}
				</CarouselContent>
				<CarouselPrevious className="hidden" />
				<CarouselNext className="hidden" />
			</Carousel>
		</div>
	);
}
