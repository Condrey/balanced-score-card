import { ThemeToggle } from "@/components/theme.toggle";

export default function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer className="text-secondary-foreground bg-secondary w-full   ">
			<div className="px-4 py-1 flex max-w-5xl w-full  items-center  mx-auto justify-center ">
				<p className="flex flex-1 justify-center items-center">Balanced Score Card Generator © {year}</p>
				<ThemeToggle />
			</div>
		</footer>
	);
}
