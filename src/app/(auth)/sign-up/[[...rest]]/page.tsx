import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
	return (
		<section className="flex flex-1 items-center justify-center">
			<SignUp />
		</section>
	);
};

export default SignUpPage;
