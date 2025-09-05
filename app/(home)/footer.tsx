export default function Footer(){
    const year = new Date().getFullYear();
    return (
        <footer className="bg-secondary p-4 flex flex-col items-center justify-center text-secondary-foreground">
            <p>Balanced Score Card Generator © {year}</p>
        </footer>
    )
}