import { Card, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import prisma from "@/lib/prisma";
import { StarIcon } from "lucide-react";
import Image from "next/image";

export default async function PeerReviews() {
	const peerReviews = await prisma.peerReview.findMany({ include: { user: true } });
	if (!peerReviews.length) return null;
	return (
		<div className="md:bg-gradient-to-r from-primary py-12 space-y-4 sm:py-16 text-white to-cyan-500">
			<h1 className="text-xl md:text-2xl lg:text-3xl text-center uppercase  tracking-tight">What People have to say</h1>
			<div className="max-w-7xl w-full mx-auto">
				<Carousel>
					<CarouselContent>
						{[...peerReviews, ...peerReviews, ...peerReviews, ...peerReviews].map((peerReview, index) => {
							const {
								id,
								rating,
								review,
								user: { email, image, name }
							} = peerReview;
							return (
								<CarouselItem key={id + index} className="md:basis-1/3 sm:basis-2 ps-4">
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
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
		</div>
	);
}
