import { LoginForm } from '@/components/login-form'

export const metadata = {
	title: 'Login',
	description: 'Log in to your NEXTSITE account.',
}

interface LoginPageProps {
	searchParams: Promise<{ next?: string | string[] }>
}

export default async function LoginPage ({
	searchParams,
}: LoginPageProps) {
	const params = await searchParams
	const nextValue = Array.isArray(params.next)
		? params.next[0]
		: params.next

	return <LoginForm nextPath={nextValue} />
}
