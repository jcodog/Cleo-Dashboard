import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
	return (
		<section className="flex flex-1 items-center justify-center">
			<SignIn />
		</section>
	);
};

export default SignInPage;
