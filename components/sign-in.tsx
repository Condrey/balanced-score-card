import { signIn } from "@/auth";
import { Button, ButtonProps } from "./ui/button";
interface SignInPops extends ButtonProps{

}
export default function SignIn({...props}: SignInPops) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button type="submit" title="Sign in with Google" {...props}/>
    </form>
  );
}
