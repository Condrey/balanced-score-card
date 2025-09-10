"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { PeerReviewData } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import AutoScroll from "embla-carousel-auto-scroll";
import { DotIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export default function PeerReviewsClient({ peerReviews }: { peerReviews: PeerReviewData[] }) {
	const plugin = useRef(AutoScroll({ playOnInit: true, stopOnInteraction: true, direction: "forward" }));
	return (
		<div className="max-w-7xl w-full mx-auto">
			<Carousel
				plugins={[plugin.current]}
				onMouseLeave={plugin.current.reset}
				onMouseEnter={plugin.current.stop}
				opts={{ loop: true }}
				className="w-full"
			>
				<CarouselContent className="-ms-6">
					{[...peerReviews].map((peerReview, index) => {
						const {
							id,
							rating,
							review,
							createdAt,
							updatedAt,
							user: { email, image, name }
						} = peerReview;
						const date = updatedAt > createdAt ? formatDate(updatedAt) : formatDate(createdAt);
						return (
							<CarouselItem key={id + index} className="lg:basis-1/3 sm:basis-1/2 ml-4">
								<Card className="bg-white/10 border-0   text-inherit p-4 rounded-md backdrop-blur-xl flex flex-col md:flex-row gap-2">
									<div className="hidden sm:flex flex-none  justify-center items-center">
										<Image
											src={image!}
											alt="user image"
											height={250}
											width={250}
											className="size-[95px] rounded-full"
										/>
									</div>
									<div className="flex flex-col">
										<div className="flex gap-3">
											<div className=" flex-none   flex sm:hidden justify-center items-center">
												<Image
													src={image!}
													alt="user image"
													height={250}
													width={250}
													className="size-[45px] rounded-full"
												/>
											</div>
											<div className="flex-1">
												<CardTitle className="text-primary  text-lg uppercase  line-clamp-1 text-ellipsis ">
													{name}
												</CardTitle>
												<div className="text-xs flex items-center text-primary">
													<span className="line-clamp-1 text-ellipsis">{email}</span>
													<DotIcon className="inline flex-none" />
													<span className="flex-none">{date}</span>
												</div>
											</div>
										</div>
										<p className="line-clamp-4 text-sm my-3 flex-1 text-ellipsis leading-tight ">{review}</p>
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
