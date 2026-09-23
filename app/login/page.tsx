import { AuthEntryScreen } from '@/components/auth-entry-screen'

export const metadata = {
	title: 'Login',
	description: 'Log in to your NEXTSITE account.',
}

export default function LoginPage () {
	return <AuthEntryScreen mode="login" />
}
