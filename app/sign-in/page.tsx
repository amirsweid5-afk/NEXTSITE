import { AuthEntryScreen } from '@/components/auth-entry-screen'

export const metadata = {
	title: 'Sign in',
	description: 'Sign in to NEXTSITE.',
}

export default function SignInPage () {
	return <AuthEntryScreen mode="signIn" />
}
