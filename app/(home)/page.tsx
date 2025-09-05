import SignIn from "@/components/sign-in";
import DescriptionOfBsc from "./description-of-bsc";
import Footer from "./footer";
import ReasonForBsc from "./reason-for-bsc";
import { MoveRightIcon } from "lucide-react";
import WebFunctions from "./web-functions";

export default function Home() {
  return (
    <div className=" flex min-h-dvh flex-col">
      {/* content  */}
      <section className="mx-auto w-full max-w-5xl flex-1 space-y-12 p-4">
         {/* sign in button  */}
         <div className="flex justify-end">
            <SignIn className="text-xl">Generate My BSC</SignIn>
        </div>
        <DescriptionOfBsc />
        <ReasonForBsc />
        <WebFunctions/>
        {/* sign in button  */}
        <div className="flex justify-end">
            <SignIn variant={'secondary'}>Get started <MoveRightIcon/></SignIn>
        </div>
        {/* stats  */}
      </section>
      {/* Footer  */}
      <Footer />
    </div>
  );
}
