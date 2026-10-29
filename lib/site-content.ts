import { type Language } from '@/lib/language'

export interface NavContent {
	home: string
	aboutUs: string
	services: string
	booking: string
	dashboard: string
	bookNow: string
	login: string
	signIn: string
	account: string
	menu: string
	close: string
	primary: string
	toggleLanguage: string
	english: string
	arabic: string
}

export interface AccountPanelContent {
	title: string
	close: string
	changeProfile: string
	removePhoto: string
	photoError: string
	photoSaving: string
	manageAccount: string
	manageHint: string
	switchToLogin: string
	switchToSignIn: string
	bookProject: string
	signOut: string
	copyEmail: string
	copied: string
	customer: string
	admin: string
	back: string
	name: string
	nameError: string
	phone: string
	phonePlaceholder: string
	phoneError: string
	currentPassword: string
	currentPasswordError: string
	newPassword: string
	passwordError: string
	confirmPassword: string
	confirmPasswordError: string
	passwordHint: string
	save: string
	saving: string
	saved: string
	saveError: string
	signedOut: string
}

export interface BookingHeroStep {
	mark: string
	title: string
	detail: string
}

export interface BookingHeroContent {
	eyebrow: string
	titleLead: string
	titleAccent: string
	description: string
	ctaLabel: string
	scrollHint: string
	promise: string
	steps: BookingHeroStep[]
}

export interface ServiceItemContent {
	id: string
	title: string
	description: string
	features: string[]
	priceLabel: string
}

export interface FeatureItemContent {
	id: string
	title: string
	description: string
}

export interface SiteContent {
	skipToContent: string
	themeToggle: string
	globeToggle: string
	nav: NavContent
	accountPanel: AccountPanelContent
	home: {
		hero: {
			brand: string
			title: string
			description: string
			ctaLabel: string
			secondaryCtaLabel: string
		}
		services: {
			eyebrow: string
			title: string
			description: string
			bookNow: string
			items: ServiceItemContent[]
		}
		whyChooseUs: {
			eyebrow: string
			title: string
			description: string
			items: FeatureItemContent[]
		}
		bookingCta: {
			eyebrow: string
			title: string
			description: string
			ctaLabel: string
		}
		portfolio: {
			eyebrow: string
			title: string
			description: string
			conceptLabel: string
			items: {
				id: string
				name: string
				category: string
				description: string
			}[]
		}
		aiClip: {
			label: string
			prompt: string
			lines: string[]
		}
	}
	about: {
		hero: {
			eyebrow: string
			titleLead: string
			titleAccent: string
			description: string
			bookLabel: string
			workLabel: string
			traits: string
			previewUrl: string
			previewBrand: string
			previewWork: string
			previewServices: string
			previewContact: string
			previewCta: string
			cards: string[]
		}
		story: {
			eyebrow: string
			title: string
			intro: string
			whoTitle: string
			whoBody: string
			specialties: string[]
			blocks: FeatureItemContent[]
			journeyEyebrow: string
			journeyCaption: string
			steps: {
				step: string
				label: string
				detail: string
			}[]
			todayTitle: string
		}
		mission: {
			eyebrow: string
			title: string
			paragraphOne: string
			paragraphTwo: string
			values: FeatureItemContent[]
		}
		vision: {
			eyebrow: string
			titleLead: string
			titleAccent: string
			paragraphOne: string
			paragraphTwo: string
			paragraphThree: string
			traits: string[]
			points: FeatureItemContent[]
		}
		process: {
			eyebrow: string
			title: string
			description: string
			ctaLabel: string
			steps: {
				step: string
				title: string
				description: string
			}[]
		}
	}
	booking: {
		hero: BookingHeroContent
		form: {
			eyebrow: string
			title: string
			description: string
			fullName: string
			fullNamePlaceholder: string
			fullNameError: string
			email: string
			emailPlaceholder: string
			emailError: string
			phone: string
			phonePlaceholder: string
			phoneError: string
			country: string
			countryError: string
			service: string
			servicePlaceholder: string
			serviceError: string
			website: string
			websitePlaceholder: string
			websiteError: string
			budget: string
			budgetPlaceholder: string
			budgetError: string
			deadline: string
			deadlinePlaceholder: string
			deadlineError: string
			submit: string
			submitting: string
			confirmedTitle: string
			confirmedBody: string
			confirmedThanks: string
			backHome: string
			saveError: string
			noServices: string
		}
	}
	dashboard: {
		eyebrow: string
		title: string
		badge: string
		description: string
		totalBookings: string
		pendingBookings: string
		recentTitle: string
		recentDescription: string
		revenueTitle: string
		revenueDescription: string
		totalRevenue: string
		revenueThisMonth: string
		pendingPayments: string
		monthlyChartTitle: string
		monthlyChartHint: string
		revenueByService: string
		noRevenueYet: string
		empty: string
		client: string
		status: string
		statusPending: string
		statusAccepted: string
		statusCompleted: string
		statusCancelled: string
		projectPrice: string
		amountPaid: string
		remaining: string
		paymentStatus: string
		paymentUnpriced: string
		paymentUnpaid: string
		paymentPartial: string
		paymentPaid: string
		notSet: string
		setPrice: string
		savePrice: string
		recordPayment: string
		paymentPlaceholder: string
		addPayment: string
		noPaymentsYet: string
		priceError: string
		paymentError: string
		viewDetails: string
		hideDetails: string
		fullName: string
		email: string
		phone: string
		service: string
		website: string
		noPhone: string
		noWebsite: string
		delete: string
		deleting: string
		deleteConfirm: string
		deleteError: string
	}
	auth: {
		loginEyebrow: string
		loginTitle: string
		loginDescription: string
		signInEyebrow: string
		signInTitle: string
		signInDescription: string
		fullName: string
		fullNamePlaceholder: string
		fullNameError: string
		email: string
		emailPlaceholder: string
		emailError: string
		password: string
		passwordPlaceholder: string
		passwordError: string
		showPassword: string
		hidePassword: string
		confirmPassword: string
		confirmPasswordPlaceholder: string
		confirmPasswordError: string
		loginSubmit: string
		loginSubmitting: string
		signInSubmit: string
		signInSubmitting: string
		loginError: string
		signInError: string
		checkEmail: string
		hasAccount: string
		noAccount: string
		goLogin: string
		goSignIn: string
	}
	footer: {
		tagline: string
		bookNow: string
		navigate: string
		services: string
		contact: string
		rights: string
		nav: { href: string; label: string }[]
		serviceLinks: { href: string; label: string }[]
	}
}

const ENGLISH: SiteContent = {
	skipToContent: 'Skip to content',
	themeToggle: 'Toggle color theme',
	globeToggle: 'Show or hide the background globe',
	nav: {
		home: 'Home',
		aboutUs: 'About Us',
		services: 'Services',
		booking: 'Booking',
		dashboard: 'Admin Portal',
		bookNow: 'Book Now',
		login: 'Login',
		signIn: 'Sign in',
		account: 'Account',
		menu: 'Menu',
		close: 'Close',
		primary: 'Primary',
		toggleLanguage: 'Toggle language',
		english: 'EN',
		arabic: 'AR',
	},
	accountPanel: {
		title: 'Your account',
		close: 'Close account menu',
		changeProfile: 'Change profile',
		removePhoto: 'Remove photo',
		photoError: 'Choose a JPG, PNG, or WebP image under 2 MB.',
		photoSaving: 'Saving photo...',
		manageAccount: 'Manage account',
		manageHint: 'Name, phone, and password',
		switchToLogin: 'Login with another account',
		switchToSignIn: 'Sign in with another account',
		bookProject: 'Book a project',
		signOut: 'Sign out',
		copyEmail: 'Copy email',
		copied: 'Copied',
		customer: 'Customer',
		admin: 'Admin',
		back: 'Back',
		name: 'Name',
		nameError: 'Enter your name.',
		phone: 'Phone',
		phonePlaceholder: 'Optional phone number',
		phoneError: 'Enter a valid phone number.',
		currentPassword: 'Current password (optional)',
		currentPasswordError: 'Current password is incorrect.',
		newPassword: 'New password',
		passwordError: 'Password must be at least 8 characters.',
		confirmPassword: 'Confirm new password',
		confirmPasswordError: 'Passwords do not match.',
		passwordHint: 'Leave the password blank to keep the current one.',
		save: 'Save changes',
		saving: 'Saving...',
		saved: 'Account updated.',
		saveError: 'Could not save your account. Please try again.',
		signedOut: 'Your session ended. Log in again.',
	},
	home: {
		hero: {
			brand: 'NEXTSITE',
			title: 'Your Vision. Our Code.',
			description:
				'Build a stunning digital presence with modern, responsive websites designed around your goals.',
			ctaLabel: 'Start Your Project',
			secondaryCtaLabel: 'Explore Our Services',
		},
		services: {
			eyebrow: 'Services',
			title: 'What I Offer',
			description:
				'Professional websites designed to bring your ideas to life.',
			bookNow: 'Start Your Project',
			items: [
				{
					id: 'landing-page',
					title: 'Landing Pages',
					description:
						'A focused single-page site for a product, offer, or campaign.',
					features: [
						'One page built around a single goal',
						'Readable on phones and desktops',
						'A direct path to contact or booking',
					],
					priceLabel: 'Starting from $200',
				},
				{
					id: 'static-website',
					title: 'Static Websites',
					description:
						'A multi-page site for a business or organization.',
					features: [
						'Several pages for your content',
						'Fast pages without a heavy app',
						'A structure visitors can browse',
					],
					priceLabel: 'Starting from $300',
				},
				{
					id: 'personal-website',
					title: 'Personal Websites',
					description:
						'A site for your work, skills, and personal brand.',
					features: [
						'A home for your story and work',
						'Clear sections for what you offer',
						'A simple way for people to reach you',
					],
					priceLabel: 'Starting from $250',
				},
			],
		},
		whyChooseUs: {
			eyebrow: 'Why Us',
			title: 'Why Choose Us?',
			description:
				'A straightforward way to plan, build, and launch a website.',
			items: [
				{
					id: 'custom-designs',
					title: 'Built Around Your Goals',
					description:
						'The site is planned around what you want visitors to do, not a generic template.',
				},
				{
					id: 'fully-responsive',
					title: 'Responsive by Design',
					description:
						'Layouts stay readable on phones, tablets, and desktops.',
				},
				{
					id: 'personal-support',
					title: 'Clear Communication',
					description:
						'You can follow the project from the first brief through launch.',
				},
				{
					id: 'fast-modern',
					title: 'Performance Matters',
					description:
						'Pages are kept lean so they load quickly and stay easy to use.',
				},
			],
		},
		bookingCta: {
			eyebrow: 'Next Step',
			title: 'Your Next Big Idea Starts Here.',
			description:
				'Tell us what you\'re building, and let\'s turn your idea into a website.',
			ctaLabel: 'Start Your Project',
		},
		portfolio: {
			eyebrow: 'Work',
			title: 'Project directions',
			description:
				'These are labelled concept directions, not client case studies.',
			conceptLabel: 'Concept',
			items: [
				{
					id: 'campaign',
					name: 'Campaign landing',
					category: 'Landing Pages',
					description:
						'A single-page layout for presenting one offer.',
				},
				{
					id: 'studio',
					name: 'Business site',
					category: 'Static Websites',
					description:
						'A multi-page structure with a clear path to services.',
				},
				{
					id: 'personal',
					name: 'Personal portfolio',
					category: 'Personal Websites',
					description:
						'A personal site for showing work and contact details.',
				},
			],
		},
		aiClip: {
			label: 'AI typing',
			prompt: 'Build a modern site for my brand.',
			lines: [
				'Reading your idea…',
				'Choosing layout and type…',
				'Writing the page copy…',
				'Polishing the final site…',
			],
		},
	},
	about: {
		hero: {
			eyebrow: 'Digital Studio',
			titleLead: 'Build Your',
			titleAccent: 'Digital Presence.',
			description:
				'We craft modern, fast, high-quality websites for businesses that want to look premium online — and convert visitors into clients.',
			bookLabel: 'Book a Consultation',
			workLabel: 'View Our Work',
			traits: 'Professional · Fast · Modern · Responsive',
			previewUrl: 'nextsite.studio/preview',
			previewBrand: 'NEXT SITE',
			previewWork: 'Work',
			previewServices: 'Services',
			previewContact: 'Contact',
			previewCta: 'Start Project',
			cards: [
				'Business Websites',
				'E-Commerce',
				'Custom Design',
				'Responsive Design',
			],
		},
		story: {
			eyebrow: 'About Us',
			title: 'Our Story',
			intro:
				'We’re a small, passionate web development team — real people who love building modern websites for businesses, professionals, and individuals.',
			whoTitle: 'Who We Are',
			whoBody:
				'We focus on creating clean, thoughtful websites that help people show up professionally online — without the overcomplicated process. We specialize in:',
			specialties: [
				'Landing Pages',
				'Static Websites',
				'Personal Websites',
			],
			blocks: [
				{
					id: 'how-it-started',
					title: 'How It Started',
					description:
						'It started simply — we kept building websites for friends, local businesses, and personal projects. What began as a hobby quickly became something we wanted to do more of. The more we built, the clearer it became that we could turn this skill and passion into a real business.',
				},
				{
					id: 'why-we-started',
					title: 'Why We Started',
					description:
						'We started because we genuinely enjoy creating websites — and we wanted to help people and businesses show up online in a way that feels true to them. For us, a great website is not just about looking good. It needs to be useful, responsive, and built around what each client actually needs.',
				},
			],
			journeyEyebrow: 'The Journey',
			journeyCaption: 'From side projects to helping clients',
			steps: [
				{
					step: '01',
					label: 'Built our first websites',
					detail: 'For friends and personal ideas',
				},
				{
					step: '02',
					label: 'Helped local businesses',
					detail: 'Simple sites that actually worked',
				},
				{
					step: '03',
					label: 'Turned passion into Creativity',
					detail: 'A small team, client by client',
				},
			],
			todayTitle: 'What we build today',
		},
		mission: {
			eyebrow: 'What We Stand For',
			title: 'Our Mission',
			paragraphOne:
				'Our mission is to help businesses, professionals, and individuals build a strong online presence through modern, professional, and personalized websites.',
			paragraphTwo:
				'We don’t simply build websites — we take your ideas and turn them into a website that fits your goals, identity, and audience.',
			values: [
				{
					id: 'quality',
					title: 'Quality',
					description:
						'We focus on creating polished websites with attention to design, performance, and details.',
				},
				{
					id: 'personalization',
					title: 'Personalization',
					description:
						'Every website is built around the client’s unique needs, style, and goals.',
				},
				{
					id: 'simplicity',
					title: 'Simplicity',
					description:
						'We believe websites should be easy to understand, navigate, and use.',
				},
				{
					id: 'satisfaction',
					title: 'Client Satisfaction',
					description:
						'We communicate clearly, listen to our clients, and aim to make the entire process smooth and enjoyable.',
				},
			],
		},
		vision: {
			eyebrow: 'Looking Ahead',
			titleLead: 'Our',
			titleAccent: 'Vision',
			paragraphOne:
				'Our vision is to become a trusted web development partner for businesses, professionals, and individuals who want to build a strong presence online.',
			paragraphTwo:
				'We want to create websites that feel modern, professional, fast, and accessible — tailored to each client’s identity and goals.',
			paragraphThree:
				'As we grow, we want to keep improving our skills, adopting better technologies, and creating better digital experiences for every client.',
			traits: [
				'Modern',
				'Professional',
				'Fast',
				'Accessible',
				'Tailored to each client',
			],
			points: [
				{
					id: 'grow-together',
					title: 'Grow Together',
					description:
						'Build long-term relationships with clients and grow alongside their businesses.',
				},
				{
					id: 'keep-improving',
					title: 'Keep Improving',
					description:
						'Continuously learn, improve our skills, and stay up to date with modern web technologies and design.',
				},
				{
					id: 'make-ideas-digital',
					title: 'Make Ideas Digital',
					description:
						'Turn our clients’ ideas into professional websites that help them present themselves confidently online.',
				},
			],
		},
		process: {
			eyebrow: 'How We Work',
			title: 'From idea to launch',
			description:
				'Four clear stages. Scope is confirmed before design and development begin.',
			ctaLabel: 'Start Your Project',
			steps: [
				{
					step: '01',
					title: 'Tell Us Your Idea',
					description:
						'Share what you want the website to do and who it is for.',
				},
				{
					step: '02',
					title: 'Discuss the Project',
					description:
						'We confirm the pages, the service, and what is included.',
				},
				{
					step: '03',
					title: 'Design & Development',
					description:
						'The site is designed and built around that agreed scope.',
				},
				{
					step: '04',
					title: 'Review & Launch',
					description:
						'You review the result, request adjustments, and we prepare it to go live.',
				},
			],
		},
	},
	booking: {
		hero: {
			eyebrow: 'Begin here',
			titleLead: 'Your idea is ready',
			titleAccent: 'to take form.',
			description:
				'This is the quiet moment before a website is born. Tell us what you see — we will hold it carefully, and build something that feels like you.',
			ctaLabel: 'Start your booking',
			scrollHint: 'Share your vision below',
			promise: 'A human reply · A clear next step · Made around you',
			steps: [
				{
					mark: '01',
					title: 'Speak the spark',
					detail: 'A few honest words are enough.',
				},
				{
					mark: '02',
					title: 'We listen',
					detail: 'Then we shape it with you.',
				},
				{
					mark: '03',
					title: 'It awakens',
					detail: 'A site that feels like home.',
				},
			],
		},
		form: {
			eyebrow: 'Get Started',
			title: 'Book Now',
			description:
				'Tell us about your website and we’ll get back to you to discuss the details.',
			fullName: 'Full Name',
			fullNamePlaceholder: 'Enter your full name',
			fullNameError: 'Please enter your full name.',
			email: 'Email',
			emailPlaceholder: 'Enter your email',
			emailError: 'Please enter a valid email.',
			phone: 'Phone',
			phonePlaceholder: 'Enter your phone number',
			phoneError: 'Please enter your phone number.',
			country: 'Country code',
			countryError: 'Please choose a country code.',
			service: 'Service',
			servicePlaceholder: 'Choose a service',
			serviceError: 'Please choose a service.',
			website: 'Tell us about your website',
			websitePlaceholder:
				'Describe the website you need, including its purpose, pages, features, or any ideas you have...',
			websiteError: 'Please tell us about your website.',
			budget: 'Budget',
			budgetPlaceholder: 'Optional',
			budgetError: 'Use numbers only.',
			deadline: 'Preferred deadline',
			deadlinePlaceholder: 'Optional',
			deadlineError: 'Choose a date.',
			submit: 'Submit Booking',
			submitting: 'Saving your booking...',
			confirmedTitle: 'Your project request has been received!',
			confirmedBody:
				'Thank you for choosing NEXTSITE. We\'ve received your project details and will review your request.',
			confirmedThanks: 'thank you for working with us',
			backHome: 'Back to Home',
			saveError:
				'We could not save your booking. Please try again.',
			noServices:
				'Services are unavailable right now. Please try again shortly.',
		},
	},
	dashboard: {
		eyebrow: 'Admin',
		title: 'Admin Dashboard',
		badge: 'Admin',
		description:
			'Review bookings, set project prices, and track real payments.',
		totalBookings: 'Total Bookings',
		pendingBookings: 'Pending Bookings',
		recentTitle: 'Recent Bookings',
		recentDescription:
			'Set prices, record payments, and open details for each client.',
		revenueTitle: 'Revenue & Earnings',
		revenueDescription:
			'Only recorded payments count as revenue — unpaid balances stay pending.',
		totalRevenue: 'Total Revenue Received',
		revenueThisMonth: 'Revenue This Month',
		pendingPayments: 'Pending Payments',
		monthlyChartTitle: 'Monthly Revenue',
		monthlyChartHint: 'Last 12 months from real payment records.',
		revenueByService: 'Revenue by Service',
		noRevenueYet: 'No payments recorded yet.',
		empty: 'No bookings have been submitted yet.',
		client: 'Client',
		status: 'Status',
		statusPending: 'Pending',
		statusAccepted: 'Accepted',
		statusCompleted: 'Completed',
		statusCancelled: 'Cancelled',
		projectPrice: 'Project Price',
		amountPaid: 'Amount Paid',
		remaining: 'Remaining',
		paymentStatus: 'Payment',
		paymentUnpriced: 'No price',
		paymentUnpaid: 'Unpaid',
		paymentPartial: 'Partial',
		paymentPaid: 'Paid',
		notSet: 'Not set',
		setPrice: 'Project price (USD)',
		savePrice: 'Save price',
		recordPayment: 'Record payment (USD)',
		paymentPlaceholder: 'Amount received',
		addPayment: 'Add payment',
		noPaymentsYet: 'No payments recorded for this booking.',
		priceError: 'Enter a valid USD price.',
		paymentError: 'Enter a valid payment amount.',
		viewDetails: 'See details',
		hideDetails: 'Hide details',
		fullName: 'Full Name',
		email: 'Email',
		phone: 'Phone',
		service: 'Service',
		website: 'Tell us about your website',
		noPhone: 'No phone provided',
		noWebsite: 'No website details provided',
		delete: 'Delete',
		deleting: 'Deleting...',
		deleteConfirm:
			'Delete this booking? This cannot be undone.',
		deleteError:
			'Could not delete this booking. Please try again.',
	},
	auth: {
		loginEyebrow: 'Welcome back',
		loginTitle: 'Login',
		loginDescription:
			'Enter your email and password to access your account.',
		signInEyebrow: 'Join NEXTSITE',
		signInTitle: 'Sign in',
		signInDescription:
			'Create your account to book projects and save your details.',
		fullName: 'Full Name',
		fullNamePlaceholder: 'Enter your full name',
		fullNameError: 'Please enter your full name.',
		email: 'Email',
		emailPlaceholder: 'Enter your email',
		emailError: 'Please enter a valid email.',
		password: 'Password',
		passwordPlaceholder: 'Enter your password',
		passwordError: 'Password must be at least 8 characters.',
		showPassword: 'Show password',
		hidePassword: 'Hide password',
		confirmPassword: 'Confirm Password',
		confirmPasswordPlaceholder: 'Re-enter your password',
		confirmPasswordError: 'Passwords do not match.',
		loginSubmit: 'Login',
		loginSubmitting: 'Logging in...',
		signInSubmit: 'Sign in',
		signInSubmitting: 'Creating your account...',
		loginError: 'Invalid email or password.',
		signInError: 'Could not create your account. Please try again.',
		checkEmail:
			'Check your email to confirm your account, then log in.',
		hasAccount: 'Already have an account?',
		noAccount: 'Need an account?',
		goLogin: 'Login',
		goSignIn: 'Sign in',
	},
	footer: {
		tagline: 'Modern websites built around your ideas.',
		bookNow: 'Book Now',
		navigate: 'Navigate',
		services: 'Services',
		contact: 'Contact',
		rights: '© 2026 NEXTSITE. All rights reserved.',
		nav: [
			{ href: '/', label: 'Home' },
			{ href: '/about-us', label: 'About Us' },
			{ href: '/services', label: 'Services' },
			{ href: '/booking', label: 'Booking' },
		],
		serviceLinks: [
			{ href: '/booking?service=landing-page', label: 'Landing Pages' },
			{ href: '/booking?service=static-website', label: 'Static Websites' },
			{
				href: '/booking?service=personal-website',
				label: 'Personal Websites',
			},
		],
	},
}

const ARABIC: SiteContent = {
	skipToContent: 'تخطّ إلى المحتوى',
	themeToggle: 'تبديل مظهر الألوان',
	globeToggle: 'إظهار أو إخفاء الكرة في الخلفية',
	nav: {
		home: 'الرئيسية',
		aboutUs: 'من نحن',
		services: 'الخدمات',
		booking: 'الحجز',
		dashboard: 'بوابة الإدارة',
		bookNow: 'احجز الآن',
		login: 'دخول',
		signIn: 'تسجيل',
		account: 'الحساب',
		menu: 'القائمة',
		close: 'إغلاق',
		primary: 'رئيسي',
		toggleLanguage: 'تبديل اللغة',
		english: 'EN',
		arabic: 'AR',
	},
	accountPanel: {
		title: 'حسابك',
		close: 'إغلاق الحساب',
		changeProfile: 'تغيير الصورة',
		removePhoto: 'إزالة الصورة',
		photoError: 'اختر صورة JPG أو PNG أو WebP أقل من 2 ميغابايت.',
		photoSaving: 'جارٍ حفظ الصورة...',
		manageAccount: 'إدارة الحساب',
		manageHint: 'الاسم والهاتف وكلمة المرور',
		switchToLogin: 'الدخول بحساب آخر',
		switchToSignIn: 'التسجيل بحساب آخر',
		bookProject: 'احجز مشروعاً',
		signOut: 'تسجيل الخروج',
		copyEmail: 'نسخ البريد',
		copied: 'تم النسخ',
		customer: 'عميل',
		admin: 'مدير',
		back: 'رجوع',
		name: 'الاسم',
		nameError: 'أدخل اسمك.',
		phone: 'الهاتف',
		phonePlaceholder: 'رقم هاتف اختياري',
		phoneError: 'أدخل رقم هاتف صالحاً.',
		currentPassword: 'كلمة المرور الحالية (اختياري)',
		currentPasswordError: 'كلمة المرور الحالية غير صحيحة.',
		newPassword: 'كلمة مرور جديدة',
		passwordError: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.',
		confirmPassword: 'تأكيد كلمة المرور',
		confirmPasswordError: 'كلمتا المرور غير متطابقتين.',
		passwordHint: 'اترك كلمة المرور فارغة للإبقاء على الحالية.',
		save: 'حفظ التغييرات',
		saving: 'جارٍ الحفظ...',
		saved: 'تم تحديث الحساب.',
		saveError: 'تعذر حفظ الحساب. حاول مرة أخرى.',
		signedOut: 'انتهت الجلسة. سجّل الدخول مرة أخرى.',
	},
	home: {
		hero: {
			brand: 'NEXTSITE',
			title: 'رؤيتك. كودنا.',
			description:
				'ابنِ حضوراً رقمياً واضحاً بمواقع حديثة ومتجاوبة مصمّمة حول أهدافك.',
			ctaLabel: 'ابدأ مشروعك',
			secondaryCtaLabel: 'استكشف خدماتنا',
		},
		services: {
			eyebrow: 'الخدمات',
			title: 'ماذا نقدّم',
			description:
				'مواقع احترافية مصمّمة لتحويل أفكارك إلى واقع.',
			bookNow: 'ابدأ مشروعك',
			items: [
				{
					id: 'landing-page',
					title: 'صفحات الهبوط',
					description:
						'صفحة واحدة مركّزة لمنتج أو عرض أو حملة.',
					features: [
						'صفحة واحدة مبنية حول هدف واضح',
						'مقروءة على الهاتف والحاسوب',
						'طريق مباشر للتواصل أو الحجز',
					],
					priceLabel: 'يبدأ من 200 دولار',
				},
				{
					id: 'static-website',
					title: 'المواقع الثابتة',
					description:
						'موقع متعدّد الصفحات لنشاط أو مؤسسة.',
					features: [
						'عدة صفحات لمحتواك',
						'صفحات سريعة دون تطبيق ثقيل',
						'هيكل يسهل على الزائر تصفحه',
					],
					priceLabel: 'يبدأ من 300 دولار',
				},
				{
					id: 'personal-website',
					title: 'المواقع الشخصية',
					description:
						'موقع لعملك ومهاراتك وعلامتك الشخصية.',
					features: [
						'مكان لقصتك وأعمالك',
						'أقسام واضحة لما تقدّمه',
						'طريقة بسيطة للتواصل معك',
					],
					priceLabel: 'يبدأ من 250 دولار',
				},
			],
		},
		whyChooseUs: {
			eyebrow: 'لماذا نحن',
			title: 'لماذا تختارنا؟',
			description:
				'طريقة واضحة لتخطيط الموقع وبنائه وإطلاقه.',
			items: [
				{
					id: 'custom-designs',
					title: 'مبني حول أهدافك',
					description:
						'يُخطَّط الموقع حول ما تريد من الزائر أن يفعله، لا حول قالب عام.',
				},
				{
					id: 'fully-responsive',
					title: 'متجاوب بالتصميم',
					description:
						'تبقى الصفحات مقروءة على الهاتف والجهاز اللوحي والحاسوب.',
				},
				{
					id: 'personal-support',
					title: 'تواصل واضح',
					description:
						'يمكنك متابعة المشروع من أول شرح حتى الإطلاق.',
				},
				{
					id: 'fast-modern',
					title: 'الأداء مهم',
					description:
						'تُبنى الصفحات بخفة لتُحمَّل بسرعة وتبقى سهلة الاستخدام.',
				},
			],
		},
		bookingCta: {
			eyebrow: 'الخطوة التالية',
			title: 'فكرتك الكبيرة التالية تبدأ هنا.',
			description:
				'أخبرنا بما تبنيه، ولنحوّل فكرتك إلى موقع.',
			ctaLabel: 'ابدأ مشروعك',
		},
		portfolio: {
			eyebrow: 'الأعمال',
			title: 'اتجاهات مشاريع',
			description:
				'هذه اتجاهات مفاهيمية وليست دراسات لعملاء حقيقيين.',
			conceptLabel: 'مفهوم',
			items: [
				{
					id: 'campaign',
					name: 'صفحة حملة',
					category: 'صفحات الهبوط',
					description: 'تخطيط من صفحة واحدة لعرض واحد.',
				},
				{
					id: 'studio',
					name: 'موقع أعمال',
					category: 'المواقع الثابتة',
					description: 'هيكل من عدة صفحات مع طريق واضح للخدمات.',
				},
				{
					id: 'personal',
					name: 'ملف شخصي',
					category: 'المواقع الشخصية',
					description: 'موقع شخصي لعرض العمل وبيانات التواصل.',
				},
			],
		},
		aiClip: {
			label: 'كتابة بالذكاء الاصطناعي',
			prompt: 'ابنِ موقعاً حديثاً لعلامتي.',
			lines: [
				'أقرأ فكرتك…',
				'أختار التخطيط والخطوط…',
				'أكتب نصوص الصفحة…',
				'أصقل الموقع النهائي…',
			],
		},
	},
	about: {
		hero: {
			eyebrow: 'استوديو رقمي',
			titleLead: 'ابنِ',
			titleAccent: 'حضورك الرقمي.',
			description:
				'نصمّم مواقع حديثة وسريعة وعالية الجودة للشركات التي تريد حضوراً راقياً على الإنترنت — وتحويل الزوار إلى عملاء.',
			bookLabel: 'احجز استشارة',
			workLabel: 'شاهد أعمالنا',
			traits: 'احترافي · سريع · حديث · متجاوب',
			previewUrl: 'nextsite.studio/preview',
			previewBrand: 'NEXT SITE',
			previewWork: 'الأعمال',
			previewServices: 'الخدمات',
			previewContact: 'تواصل',
			previewCta: 'ابدأ مشروعك',
			cards: [
				'مواقع الشركات',
				'التجارة الإلكترونية',
				'تصميم مخصّص',
				'تصميم متجاوب',
			],
		},
		story: {
			eyebrow: 'من نحن',
			title: 'قصتنا',
			intro:
				'نحن فريق صغير وشغوف بتطوير الويب — أشخاص حقيقيون يحبّون بناء مواقع حديثة للشركات والمحترفين والأفراد.',
			whoTitle: 'من نكون',
			whoBody:
				'نركّز على إنشاء مواقع نظيفة ومدروسة تساعد الناس على الظهور باحترافية على الإنترنت — دون تعقيد زائد. نتخصّص في:',
			specialties: [
				'صفحات الهبوط',
				'المواقع الثابتة',
				'المواقع الشخصية',
			],
			blocks: [
				{
					id: 'how-it-started',
					title: 'كيف بدأت',
					description:
						'بدأت الأمور ببساطة — كنّا نبني مواقع للأصدقاء والأعمال المحلية والمشاريع الشخصية. ما بدأ كهواية أصبح شيئاً نريد أن نفعله أكثر. كلّما بنينا أكثر، اتضح أن بإمكاننا تحويل هذه المهارة والشغف إلى عمل حقيقي.',
				},
				{
					id: 'why-we-started',
					title: 'لماذا بدأنا',
					description:
						'بدأنا لأننا نستمتع حقاً بصناعة المواقع — وأردنا مساعدة الناس والشركات على الظهور عبر الإنترنت بطريقة تعبّر عنهم. بالنسبة لنا، الموقع الرائع ليس للشكل فقط. يجب أن يكون مفيداً ومتجاوباً ومبنياً حول ما يحتاجه كل عميل فعلاً.',
				},
			],
			journeyEyebrow: 'المسيرة',
			journeyCaption: 'من مشاريع جانبية إلى مساعدة العملاء',
			steps: [
				{
					step: '01',
					label: 'بنينا مواقعنا الأولى',
					detail: 'للأصدقاء والأفكار الشخصية',
				},
				{
					step: '02',
					label: 'ساعدنا أعمالاً محلية',
					detail: 'مواقع بسيطة تعمل فعلاً',
				},
				{
					step: '03',
					label: 'حوّلنا الشغف إلى إبداع',
					detail: 'فريق صغير، عميل بعد عميل',
				},
			],
			todayTitle: 'ما نبنيه اليوم',
		},
		mission: {
			eyebrow: 'قيمنا',
			title: 'رسالتنا',
			paragraphOne:
				'رسالتنا مساعدة الشركات والمحترفين والأفراد على بناء حضور قوي عبر الإنترنت من خلال مواقع حديثة واحترافية ومخصّصة.',
			paragraphTwo:
				'نحن لا نبني مواقع فحسب — نأخذ أفكارك ونحوّلها إلى موقع يناسب أهدافك وهويتك وجمهورك.',
			values: [
				{
					id: 'quality',
					title: 'الجودة',
					description:
						'نركّز على صناعة مواقع متقنة مع عناية بالتصميم والأداء والتفاصيل.',
				},
				{
					id: 'personalization',
					title: 'التخصيص',
					description:
						'كل موقع يُبنى حول احتياجات العميل وأسلوبه وأهدافه الفريدة.',
				},
				{
					id: 'simplicity',
					title: 'البساطة',
					description:
						'نؤمن أن المواقع يجب أن تكون سهلة الفهم والتنقّل والاستخدام.',
				},
				{
					id: 'satisfaction',
					title: 'رضا العميل',
					description:
						'نتواصل بوضوح ونستمع لعملائنا ونسعى لجعل العملية كلها سلسة وممتعة.',
				},
			],
		},
		vision: {
			eyebrow: 'نظرتنا للمستقبل',
			titleLead: 'رؤيتنا',
			titleAccent: '',
			paragraphOne:
				'رؤيتنا أن نصبح شريك تطوير ويب موثوقاً للشركات والمحترفين والأفراد الذين يريدون بناء حضور قوي على الإنترنت.',
			paragraphTwo:
				'نريد إنشاء مواقع تبدو حديثة واحترافية وسريعة وسهلة الوصول — مخصّصة لهوية كل عميل وأهدافه.',
			paragraphThree:
				'ومع نموّنا، نريد مواصلة تطوير مهاراتنا وتبنّي تقنيات أفضل وصناعة تجارب رقمية أفضل لكل عميل.',
			traits: [
				'حديث',
				'احترافي',
				'سريع',
				'سهل الوصول',
				'مخصّص لكل عميل',
			],
			points: [
				{
					id: 'grow-together',
					title: 'نمو مشترك',
					description:
						'بناء علاقات طويلة الأمد مع العملاء والنمو إلى جانب أعمالهم.',
				},
				{
					id: 'keep-improving',
					title: 'تحسين مستمر',
					description:
						'التعلّم المستمر وتطوير مهاراتنا ومواكبة تقنيات وتصميم الويب الحديث.',
				},
				{
					id: 'make-ideas-digital',
					title: 'نجعل الأفكار رقمية',
					description:
						'تحويل أفكار عملائنا إلى مواقع احترافية تساعدهم على تقديم أنفسهم بثقة عبر الإنترنت.',
				},
			],
		},
		process: {
			eyebrow: 'كيف نعمل',
			title: 'من الفكرة إلى الإطلاق',
			description:
				'أربع مراحل واضحة. يُثبَّت نطاق العمل قبل التصميم والتطوير.',
			ctaLabel: 'ابدأ مشروعك',
			steps: [
				{
					step: '01',
					title: 'أخبرنا بفكرتك',
					description:
						'شارك ما تريد أن يفعله الموقع ولمن هو.',
				},
				{
					step: '02',
					title: 'نناقش المشروع',
					description:
						'نؤكد الصفحات والخدمة وما يشمله العمل.',
				},
				{
					step: '03',
					title: 'التصميم والتطوير',
					description:
						'يُصمَّم الموقع ويُبنى حول النطاق المتفق عليه.',
				},
				{
					step: '04',
					title: 'المراجعة والإطلاق',
					description:
						'تراجع النتيجة، تطلب التعديلات، ثم نجهّزه للإطلاق.',
				},
			],
		},
	},
	booking: {
		hero: {
			eyebrow: 'ابدأ من هنا',
			titleLead: 'فكرتك جاهزة',
			titleAccent: 'لتأخذ شكلها.',
			description:
				'هذه اللحظة الهادئة قبل أن يُولد الموقع. أخبرنا بما تراه — سنحملها بعناية، ونبني شيئاً يشبهك.',
			ctaLabel: 'ابدأ حجزك',
			scrollHint: 'شارك رؤيتك في الأسفل',
			promise: 'ردّ إنساني · خطوة واضحة · مصمّم حولك',
			steps: [
				{
					mark: '01',
					title: 'اروِ رؤيتك',
					detail: 'كلمات صادقة تكفي.',
				},
				{
					mark: '02',
					title: 'نصغي إليك',
					detail: 'ثم نبنيها معك.',
				},
				{
					mark: '03',
					title: 'تولد',
					detail: 'موقع يشبهك.',
				},
			],
		},
		form: {
			eyebrow: 'ابدأ الآن',
			title: 'احجز الآن',
			description:
				'أخبرنا عن موقعك وسنعود إليك لمناقشة التفاصيل.',
			fullName: 'الاسم الكامل',
			fullNamePlaceholder: 'أدخل اسمك الكامل',
			fullNameError: 'يرجى إدخال اسمك الكامل.',
			email: 'البريد الإلكتروني',
			emailPlaceholder: 'أدخل بريدك الإلكتروني',
			emailError: 'يرجى إدخال بريد إلكتروني صالح.',
			phone: 'الهاتف',
			phonePlaceholder: 'أدخل رقم هاتفك',
			phoneError: 'يرجى إدخال رقم هاتفك.',
			country: 'رمز الدولة',
			countryError: 'يرجى اختيار رمز الدولة.',
			service: 'الخدمة',
			servicePlaceholder: 'اختر خدمة',
			serviceError: 'يرجى اختيار خدمة.',
			website: 'أخبرنا عن موقعك',
			websitePlaceholder:
				'صف الموقع الذي تحتاجه، بما في ذلك الغرض والصفحات والميزات أو أي أفكار لديك...',
			websiteError: 'يرجى إخبارنا عن موقعك.',
			budget: 'الميزانية',
			budgetPlaceholder: 'اختياري',
			budgetError: 'استخدم أرقاماً فقط.',
			deadline: 'الموعد المفضّل',
			deadlinePlaceholder: 'اختياري',
			deadlineError: 'اختر تاريخاً.',
			submit: 'إرسال الحجز',
			submitting: 'جاري حفظ حجزك...',
			confirmedTitle: 'تم استلام طلب مشروعك!',
			confirmedBody:
				'شكراً لاختيارك NEXTSITE. استلمنا تفاصيل مشروعك وسنراجع طلبك.',
			confirmedThanks: 'شكراً لتعاملكم معنا',
			backHome: 'العودة إلى الرئيسية',
			saveError:
				'تعذر حفظ حجزك. يرجى المحاولة مرة أخرى.',
			noServices:
				'الخدمات غير متاحة حالياً. يرجى المحاولة بعد قليل.',
		},
	},
	dashboard: {
		eyebrow: 'المسؤول',
		title: 'لوحة الإدارة',
		badge: 'مسؤول',
		description:
			'راجع الحجوزات، حدّد أسعار المشاريع، وتتبّع المدفوعات الحقيقية.',
		totalBookings: 'إجمالي الحجوزات',
		pendingBookings: 'الحجوزات المعلّقة',
		recentTitle: 'أحدث الحجوزات',
		recentDescription:
			'حدّد الأسعار وسجّل المدفوعات وافتح تفاصيل كل عميل.',
		revenueTitle: 'الإيرادات والأرباح',
		revenueDescription:
			'تُحسب الإيرادات من المدفوعات المسجّلة فقط — الأرصدة غير المدفوعة تبقى معلّقة.',
		totalRevenue: 'إجمالي الإيرادات المستلمة',
		revenueThisMonth: 'إيرادات هذا الشهر',
		pendingPayments: 'المدفوعات المعلّقة',
		monthlyChartTitle: 'الإيرادات الشهرية',
		monthlyChartHint: 'آخر 12 شهراً من سجلات الدفع الحقيقية.',
		revenueByService: 'الإيرادات حسب الخدمة',
		noRevenueYet: 'لا توجد مدفوعات مسجّلة بعد.',
		empty: 'لا توجد حجوزات بعد.',
		client: 'العميل',
		status: 'الحالة',
		statusPending: 'معلّق',
		statusAccepted: 'مقبول',
		statusCompleted: 'مكتمل',
		statusCancelled: 'ملغى',
		projectPrice: 'سعر المشروع',
		amountPaid: 'المبلغ المدفوع',
		remaining: 'المتبقي',
		paymentStatus: 'الدفع',
		paymentUnpriced: 'بلا سعر',
		paymentUnpaid: 'غير مدفوع',
		paymentPartial: 'جزئي',
		paymentPaid: 'مدفوع',
		notSet: 'غير محدد',
		setPrice: 'سعر المشروع (دولار)',
		savePrice: 'حفظ السعر',
		recordPayment: 'تسجيل دفعة (دولار)',
		paymentPlaceholder: 'المبلغ المستلم',
		addPayment: 'إضافة دفعة',
		noPaymentsYet: 'لا توجد مدفوعات لهذا الحجز.',
		priceError: 'أدخل سعراً صالحاً بالدولار.',
		paymentError: 'أدخل مبلغ دفعة صالحاً.',
		viewDetails: 'عرض التفاصيل',
		hideDetails: 'إخفاء التفاصيل',
		fullName: 'الاسم الكامل',
		email: 'البريد الإلكتروني',
		phone: 'الهاتف',
		service: 'الخدمة',
		website: 'أخبرنا عن موقعك',
		noPhone: 'لا يوجد رقم هاتف',
		noWebsite: 'لا توجد تفاصيل عن الموقع',
		delete: 'حذف',
		deleting: 'جاري الحذف...',
		deleteConfirm: 'حذف هذا الحجز؟ لا يمكن التراجع عن ذلك.',
		deleteError: 'تعذر حذف هذا الحجز. يرجى المحاولة مرة أخرى.',
	},
	auth: {
		loginEyebrow: 'أهلاً بعودتك',
		loginTitle: 'دخول',
		loginDescription:
			'أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك.',
		signInEyebrow: 'انضم إلى NEXTSITE',
		signInTitle: 'تسجيل',
		signInDescription:
			'أنشئ حسابك لحجز المشاريع وحفظ بياناتك.',
		fullName: 'الاسم الكامل',
		fullNamePlaceholder: 'أدخل اسمك الكامل',
		fullNameError: 'يرجى إدخال اسمك الكامل.',
		email: 'البريد الإلكتروني',
		emailPlaceholder: 'أدخل بريدك الإلكتروني',
		emailError: 'يرجى إدخال بريد إلكتروني صالح.',
		password: 'كلمة المرور',
		passwordPlaceholder: 'أدخل كلمة المرور',
		passwordError: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.',
		showPassword: 'إظهار كلمة المرور',
		hidePassword: 'إخفاء كلمة المرور',
		confirmPassword: 'تأكيد كلمة المرور',
		confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
		confirmPasswordError: 'كلمتا المرور غير متطابقتين.',
		loginSubmit: 'دخول',
		loginSubmitting: 'جاري تسجيل الدخول...',
		signInSubmit: 'تسجيل',
		signInSubmitting: 'جاري إنشاء حسابك...',
		loginError: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
		signInError: 'تعذر إنشاء حسابك. يرجى المحاولة مرة أخرى.',
		checkEmail:
			'تحقق من بريدك الإلكتروني لتأكيد حسابك، ثم سجّل الدخول.',
		hasAccount: 'لديك حساب بالفعل؟',
		noAccount: 'تحتاج إلى حساب؟',
		goLogin: 'دخول',
		goSignIn: 'تسجيل',
	},
	footer: {
		tagline: 'مواقع حديثة مبنية حول أفكارك.',
		bookNow: 'احجز الآن',
		navigate: 'تنقّل',
		services: 'الخدمات',
		contact: 'تواصل',
		rights: '© 2026 NEXTSITE. جميع الحقوق محفوظة.',
		nav: [
			{ href: '/', label: 'الرئيسية' },
			{ href: '/about-us', label: 'من نحن' },
			{ href: '/services', label: 'الخدمات' },
			{ href: '/booking', label: 'الحجز' },
		],
		serviceLinks: [
			{ href: '/booking?service=landing-page', label: 'صفحات الهبوط' },
			{ href: '/booking?service=static-website', label: 'المواقع الثابتة' },
			{
				href: '/booking?service=personal-website',
				label: 'المواقع الشخصية',
			},
		],
	},
}

/**
 * Site copy in English and Arabic.
 */
export const SITE_CONTENT: Record<Language, SiteContent> = {
	en: ENGLISH,
	ar: ARABIC,
}
