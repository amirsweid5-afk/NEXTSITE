import { SignInForm } from '@/components/sign-in-form'

export const metadata = {
	title: 'Sign in',
	description: 'Create your NEXTSITE account.',
}

interface SignInPageProps {
	searchParams: Promise<{ next?: string | string[] }>
}

export default async function SignInPage ({
	searchParams,
}: SignInPageProps) {
	const params = await searchParams
	const nextValue = Array.isArray(params.next)
		? params.next[0]
		: params.next

	return <SignInForm nextPath={nextValue} />
}
