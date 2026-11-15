import { type Language } from '@/lib/language'

export interface FaqItem {
	question: string
	answer: string
}

export interface ComparisonRow {
	feature: string
	landing: string
	static: string
	personal: string
}

export interface TeamMemberPlaceholder {
	id: string
	role: string
	namePlaceholder: string
	bioPlaceholder: string
}

export interface BudgetRangeOption {
	id: string
	label: string
	value: string
}

export interface MarketingContent {
	nav: {
		portfolio: string
		faq: string
	}
	home: {
		mockup: {
			url: string
			brand: string
			navHome: string
			navWork: string
			navServices: string
			cta: string
			hint: string
		}
		howItWorks: {
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
		portfolioCta: string
	}
	servicesPage: {
		eyebrow: string
		title: string
		description: string
		comparisonTitle: string
		comparisonDescription: string
		includedTitle: string
		deliveryTitle: string
		deliveryItems: {
			id: string
			title: string
			estimate: string
			revisions: string
			includes: string[]
		}[]
		comparison: ComparisonRow[]
		faqTitle: string
		faq: FaqItem[]
	}
	aboutTeam: {
		eyebrow: string
		title: string
		description: string
		placeholderNote: string
		members: TeamMemberPlaceholder[]
	}
	portfolioPage: {
		eyebrow: string
		title: string
		description: string
		conceptLabel: string
		emptyNote: string
		ctaLabel: string
	}
	faqPage: {
		eyebrow: string
		title: string
		description: string
		items: FaqItem[]
	}
	privacy: {
		title: string
		updated: string
		sections: { heading: string; body: string }[]
	}
	terms: {
		title: string
		updated: string
		sections: { heading: string; body: string }[]
	}
	notFound: {
		title: string
		description: string
		homeLabel: string
		bookingLabel: string
	}
	loading: {
		label: string
	}
	bookingExtras: {
		guestHint: string
		accountOptional: string
		projectType: string
		budgetRange: string
		budgetRanges: BudgetRangeOption[]
		budgetCustom: string
		honeypotLabel: string
		stepContact: string
		stepProject: string
		stepDetails: string
	}
	footerLegal: {
		heading: string
		privacy: string
		terms: string
		faq: string
		portfolio: string
	}
}

const ENGLISH: MarketingContent = {
	nav: {
		portfolio: 'Portfolio',
		faq: 'FAQ',
	},
	home: {
		mockup: {
			url: 'nextsite.studio',
			brand: 'NEXTSITE',
			navHome: 'Home',
			navWork: 'Work',
			navServices: 'Services',
			cta: 'Start a project',
			hint: 'Hover the mockup to explore the layout',
		},
		howItWorks: {
			eyebrow: 'How it works',
			title: 'From idea to live site',
			description:
				'A clear path with no guesswork — you share the goal, we shape the build.',
			ctaLabel: 'Book a project',
			steps: [
				{
					step: '01',
					title: 'Share the brief',
					description:
						'Tell us what the site should do and who it is for.',
				},
				{
					step: '02',
					title: 'Agree the scope',
					description:
						'We confirm pages, package, timeline, and what is included.',
				},
				{
					step: '03',
					title: 'Design & build',
					description:
						'The site is designed and developed around that agreed plan.',
				},
				{
					step: '04',
					title: 'Review & launch',
					description:
						'You review, request adjustments, and we prepare it to go live.',
				},
			],
		},
		portfolioCta: 'View all concepts',
	},
	servicesPage: {
		eyebrow: 'Packages',
		title: 'Choose the right build',
		description:
			'Compare packages, see what is included, and know delivery expectations before you book.',
		comparisonTitle: 'Package comparison',
		comparisonDescription:
			'Side-by-side overview of the three starting packages.',
		includedTitle: 'What is included',
		deliveryTitle: 'Delivery & revisions',
		deliveryItems: [
			{
				id: 'landing-page',
				title: 'Landing Pages',
				estimate: 'Typical delivery: about 7–14 days after kickoff',
				revisions: 'Includes 2 rounds of revisions',
				includes: [
					'Single focused page',
					'Mobile-responsive layout',
					'Contact or booking path',
					'Basic SEO setup',
				],
			},
			{
				id: 'static-website',
				title: 'Static Websites',
				estimate: 'Typical delivery: about 14–28 days after kickoff',
				revisions: 'Includes 3 rounds of revisions',
				includes: [
					'Multi-page structure',
					'Shared navigation and footer',
					'Content sections for your business',
					'Performance-minded static build',
				],
			},
			{
				id: 'personal-website',
				title: 'Personal Websites',
				estimate: 'Typical delivery: about 10–21 days after kickoff',
				revisions: 'Includes 2 rounds of revisions',
				includes: [
					'Personal brand layout',
					'About and work sections',
					'Contact details',
					'Clean typography and spacing',
				],
			},
		],
		comparison: [
			{
				feature: 'Pages',
				landing: '1',
				static: '3–6',
				personal: '2–4',
			},
			{
				feature: 'Mobile ready',
				landing: 'Yes',
				static: 'Yes',
				personal: 'Yes',
			},
			{
				feature: 'Revision rounds',
				landing: '2',
				static: '3',
				personal: '2',
			},
			{
				feature: 'Starting price',
				landing: '$200',
				static: '$300',
				personal: '$250',
			},
			{
				feature: 'Best for',
				landing: 'Offers & campaigns',
				static: 'Business sites',
				personal: 'Personal brand',
			},
		],
		faqTitle: 'Services FAQ',
		faq: [
			{
				question: 'Can I change the package later?',
				answer:
					'Yes. If the scope grows, we adjust the package and price before extra work begins.',
			},
			{
				question: 'Do you write the content?',
				answer:
					'You provide the core text and images. We can help structure and polish wording within the agreed scope.',
			},
			{
				question: 'What happens after launch?',
				answer:
					'You receive the finished site. Ongoing updates can be discussed as a separate request.',
			},
		],
	},
	aboutTeam: {
		eyebrow: 'People',
		title: 'Meet the team',
		description:
			'NEXTSITE is a small studio. Roles below are placeholders until full profiles are published.',
		placeholderNote:
			'Names and photos will be added when available. No invented credentials.',
		members: [
			{
				id: 'founder',
				role: 'Founder / Lead',
				namePlaceholder: 'Name coming soon',
				bioPlaceholder:
					'Role overview and short bio will appear here.',
			},
			{
				id: 'design',
				role: 'Design',
				namePlaceholder: 'Name coming soon',
				bioPlaceholder:
					'Design focus and background will appear here.',
			},
			{
				id: 'development',
				role: 'Development',
				namePlaceholder: 'Name coming soon',
				bioPlaceholder:
					'Development focus and background will appear here.',
			},
		],
	},
	portfolioPage: {
		eyebrow: 'Portfolio',
		title: 'Concept directions',
		description:
			'These are concept directions, not published client case studies. Real work will be listed here when it can be shared.',
		conceptLabel: 'Concept',
		emptyNote:
			'No public client case studies are listed yet.',
		ctaLabel: 'Start a project',
	},
	faqPage: {
		eyebrow: 'FAQ',
		title: 'Common questions',
		description:
			'Practical answers about booking, delivery, and working with NEXTSITE.',
		items: [
			{
				question: 'How do I start a project?',
				answer:
					'Use the booking form to share your goals, package preference, budget range, and preferred deadline. A reply follows with next steps.',
			},
			{
				question: 'Do I need an account to book?',
				answer:
					'No. Guests can submit a booking with contact details. Creating an account lets you view and edit your bookings later.',
			},
			{
				question: 'How long does a website take?',
				answer:
					'Timing depends on the package and how quickly content is ready. Delivery estimates are listed on the Services page.',
			},
			{
				question: 'What is included in revisions?',
				answer:
					'Each package includes a set number of revision rounds for layout and content adjustments within the agreed scope.',
			},
			{
				question: 'How are payments handled?',
				answer:
					'Pricing starts from the package amounts shown. Final price and payment steps are confirmed after reviewing your brief.',
			},
		],
	},
	privacy: {
		title: 'Privacy Policy',
		updated: 'Last updated: November 2026',
		sections: [
			{
				heading: 'What we collect',
				body:
					'When you book or create an account, we collect the details you submit — such as name, email, phone, and project description — to respond and deliver the work.',
			},
			{
				heading: 'How we use information',
				body:
					'We use your information to manage bookings, communicate about projects, and operate the NEXTSITE site and admin tools. We do not sell your personal information.',
			},
			{
				heading: 'Storage and access',
				body:
					'Data is stored with our hosting and database providers (including Supabase where configured). Access is limited to operating the service and fulfilling requests.',
			},
			{
				heading: 'Your choices',
				body:
					'You may request updates or deletion of account-related data by contacting us at the email listed in the site footer. Some records may be retained where needed for project history or legal reasons.',
			},
			{
				heading: 'Contact',
				body:
					'Questions about privacy can be sent to the contact email shown in the footer.',
			},
		],
	},
	terms: {
		title: 'Terms and Conditions',
		updated: 'Last updated: November 2026',
		sections: [
			{
				heading: 'Services',
				body:
					'NEXTSITE provides website design and development services as described on the Services pages. Scope, price, and timeline are confirmed for each project before work proceeds.',
			},
			{
				heading: 'Bookings',
				body:
					'Submitting a booking is a request, not an automatic contract. We review each request and confirm next steps. You are responsible for providing accurate contact and project details.',
			},
			{
				heading: 'Content you provide',
				body:
					'You confirm you have the rights to text, images, and materials you supply. You remain responsible for the accuracy of that content.',
			},
			{
				heading: 'Revisions and delivery',
				body:
					'Packages include the revision rounds stated on the Services page. Extra scope or revisions beyond the agreement may require an updated quote.',
			},
			{
				heading: 'Limitation',
				body:
					'To the extent allowed by law, NEXTSITE is not liable for indirect or consequential losses arising from use of the site or delivered work. Total liability related to a project is limited to fees paid for that project.',
			},
			{
				heading: 'Contact',
				body:
					'Questions about these terms can be sent to the contact email shown in the footer.',
			},
		],
	},
	notFound: {
		title: 'Page not found',
		description:
			'That page does not exist or was moved. Head home or start a booking.',
		homeLabel: 'Back to home',
		bookingLabel: 'Book a project',
	},
	loading: {
		label: 'Loading NEXTSITE',
	},
	bookingExtras: {
		guestHint:
			'You can book as a guest. Create an account if you want to manage bookings later.',
		accountOptional: 'Account optional',
		projectType: 'Project type',
		budgetRange: 'Budget range',
		budgetRanges: [
			{ id: 'under-250', label: 'Under $250', value: '$200' },
			{ id: '250-400', label: '$250 – $400', value: '$300' },
			{ id: '400-plus', label: '$400+', value: '$500' },
			{ id: 'unsure', label: 'Not sure yet', value: '' },
		],
		budgetCustom: 'Or enter a custom amount',
		honeypotLabel: 'Company website',
		stepContact: 'Contact',
		stepProject: 'Project',
		stepDetails: 'Details',
	},
	footerLegal: {
		heading: 'Legal',
		privacy: 'Privacy Policy',
		terms: 'Terms',
		faq: 'FAQ',
		portfolio: 'Portfolio',
	},
}

const ARABIC: MarketingContent = {
	nav: {
		portfolio: 'الأعمال',
		faq: 'الأسئلة',
	},
	home: {
		mockup: {
			url: 'nextsite.studio',
			brand: 'NEXTSITE',
			navHome: 'الرئيسية',
			navWork: 'الأعمال',
			navServices: 'الخدمات',
			cta: 'ابدأ مشروعك',
			hint: 'مرّر على النموذج لاستكشاف التخطيط',
		},
		howItWorks: {
			eyebrow: 'كيف نعمل',
			title: 'من الفكرة إلى موقع حي',
			description:
				'مسار واضح بلا تخمين — تشارك الهدف، ونحن نبني حوله.',
			ctaLabel: 'احجز مشروعاً',
			steps: [
				{
					step: '01',
					title: 'شارك الملخص',
					description:
						'أخبرنا بما يجب أن يفعله الموقع ولمن هو.',
				},
				{
					step: '02',
					title: 'نتفق على النطاق',
					description:
						'نؤكد الصفحات والحزمة والجدول وما يشمله العمل.',
				},
				{
					step: '03',
					title: 'تصميم وبناء',
					description:
						'يُصمم الموقع ويُبنى وفق الخطة المتفق عليها.',
				},
				{
					step: '04',
					title: 'مراجعة وإطلاق',
					description:
						'تراجع النتيجة، تطلب تعديلات، ونجهّزه للإطلاق.',
				},
			],
		},
		portfolioCta: 'عرض كل المفاهيم',
	},
	servicesPage: {
		eyebrow: 'الباقات',
		title: 'اختر البناء المناسب',
		description:
			'قارن الباقات، اطّلع على ما يشمله كل عرض، واعرف توقعات التسليم قبل الحجز.',
		comparisonTitle: 'مقارنة الباقات',
		comparisonDescription:
			'نظرة جنبًا إلى جنب على الباقات الثلاث الأساسية.',
		includedTitle: 'ما الذي يشمله العرض',
		deliveryTitle: 'التسليم والتعديلات',
		deliveryItems: [
			{
				id: 'landing-page',
				title: 'صفحات الهبوط',
				estimate: 'التسليم المعتاد: حوالي 7–14 يومًا بعد البدء',
				revisions: 'يشمل جولتين من التعديلات',
				includes: [
					'صفحة واحدة مركّزة',
					'تصميم متجاوب للجوال',
					'مسار تواصل أو حجز',
					'إعداد أساسي لمحركات البحث',
				],
			},
			{
				id: 'static-website',
				title: 'المواقع الثابتة',
				estimate: 'التسليم المعتاد: حوالي 14–28 يومًا بعد البدء',
				revisions: 'يشمل 3 جولات من التعديلات',
				includes: [
					'هيكل متعدد الصفحات',
					'تنقل وتذييل مشتركان',
					'أقسام محتوى لعملك',
					'بناء ثابت يراعي الأداء',
				],
			},
			{
				id: 'personal-website',
				title: 'المواقع الشخصية',
				estimate: 'التسليم المعتاد: حوالي 10–21 يومًا بعد البدء',
				revisions: 'يشمل جولتين من التعديلات',
				includes: [
					'تخطيط للعلامة الشخصية',
					'أقسام عنّي وأعمالي',
					'بيانات التواصل',
					'طباعة ومسافات نظيفة',
				],
			},
		],
		comparison: [
			{
				feature: 'الصفحات',
				landing: '1',
				static: '3–6',
				personal: '2–4',
			},
			{
				feature: 'جاهز للجوال',
				landing: 'نعم',
				static: 'نعم',
				personal: 'نعم',
			},
			{
				feature: 'جولات التعديل',
				landing: '2',
				static: '3',
				personal: '2',
			},
			{
				feature: 'السعر الابتدائي',
				landing: '$200',
				static: '$300',
				personal: '$250',
			},
			{
				feature: 'الأنسب لـ',
				landing: 'العروض والحملات',
				static: 'مواقع الأعمال',
				personal: 'العلامة الشخصية',
			},
		],
		faqTitle: 'أسئلة الخدمات',
		faq: [
			{
				question: 'هل يمكن تغيير الباقة لاحقًا؟',
				answer:
					'نعم. إذا توسّع النطاق نعدّل الباقة والسعر قبل بدء عمل إضافي.',
			},
			{
				question: 'هل تكتبون المحتوى؟',
				answer:
					'أنت تقدّم النصوص والصور الأساسية. يمكننا المساعدة في تنظيم النص وصقله ضمن النطاق المتفق عليه.',
			},
			{
				question: 'ماذا بعد الإطلاق؟',
				answer:
					'تستلم الموقع النهائي. التحديثات المستمرة يمكن مناقشتها كطلب منفصل.',
			},
		],
	},
	aboutTeam: {
		eyebrow: 'الفريق',
		title: 'تعرّف على الفريق',
		description:
			'NEXTSITE استوديو صغير. الأدوار أدناه مؤقتة إلى أن تُنشر الملفات الشخصية الكاملة.',
		placeholderNote:
			'ستُضاف الأسماء والصور عند توفرها. لا نختلق إنجازات.',
		members: [
			{
				id: 'founder',
				role: 'المؤسس / القائد',
				namePlaceholder: 'الاسم قريبًا',
				bioPlaceholder: 'ستظهر هنا نبذة عن الدور.',
			},
			{
				id: 'design',
				role: 'التصميم',
				namePlaceholder: 'الاسم قريبًا',
				bioPlaceholder: 'ستظهر هنا نبذة عن التصميم.',
			},
			{
				id: 'development',
				role: 'التطوير',
				namePlaceholder: 'الاسم قريبًا',
				bioPlaceholder: 'ستظهر هنا نبذة عن التطوير.',
			},
		],
	},
	portfolioPage: {
		eyebrow: 'الأعمال',
		title: 'اتجاهات مفاهيمية',
		description:
			'هذه اتجاهات مفاهيمية وليست دراسات حالة لعملاء منشورين. ستُدرج الأعمال الحقيقية عند إمكانية مشاركتها.',
		conceptLabel: 'مفهوم',
		emptyNote: 'لا توجد دراسات حالة عامة بعد.',
		ctaLabel: 'ابدأ مشروعًا',
	},
	faqPage: {
		eyebrow: 'الأسئلة',
		title: 'أسئلة شائعة',
		description:
			'إجابات عملية حول الحجز والتسليم والعمل مع NEXTSITE.',
		items: [
			{
				question: 'كيف أبدأ مشروعًا؟',
				answer:
					'استخدم نموذج الحجز لمشاركة أهدافك والباقة والميزانية والموعد المفضّل. نردّ بالخطوات التالية.',
			},
			{
				question: 'هل أحتاج حسابًا للحجز؟',
				answer:
					'لا. يمكن للزوار إرسال حجز ببيانات التواصل. إنشاء حساب يتيح لاحقًا عرض حجوزاتك وتعديلها.',
			},
			{
				question: 'كم يستغرق الموقع؟',
				answer:
					'يعتمد على الباقة وسرعة تجهيز المحتوى. تقديرات التسليم موجودة في صفحة الخدمات.',
			},
			{
				question: 'ماذا تشمل التعديلات؟',
				answer:
					'كل باقة تتضمن عددًا محددًا من جولات التعديل ضمن النطاق المتفق عليه.',
			},
			{
				question: 'كيف تتم المدفوعات؟',
				answer:
					'الأسعار تبدأ من مبالغ الباقات المعروضة. يُؤكد السعر النهائي وخطوات الدفع بعد مراجعة الملخص.',
			},
		],
	},
	privacy: {
		title: 'سياسة الخصوصية',
		updated: 'آخر تحديث: نوفمبر 2026',
		sections: [
			{
				heading: 'ما الذي نجمعه',
				body:
					'عند الحجز أو إنشاء حساب نجمع البيانات التي ترسلها — مثل الاسم والبريد والهاتف ووصف المشروع — للرد وتنفيذ العمل.',
			},
			{
				heading: 'كيف نستخدم المعلومات',
				body:
					'نستخدم معلوماتك لإدارة الحجوزات والتواصل حول المشاريع وتشغيل الموقع وأدوات الإدارة. لا نبيع معلوماتك الشخصية.',
			},
			{
				heading: 'التخزين والوصول',
				body:
					'تُخزَّن البيانات لدى مزودي الاستضافة وقاعدة البيانات (بما في ذلك Supabase عند تهيئته). الوصول محدود لتشغيل الخدمة وتنفيذ الطلبات.',
			},
			{
				heading: 'خياراتك',
				body:
					'يمكنك طلب تحديث أو حذف بيانات الحساب عبر البريد الظاهر في تذييل الموقع. قد تُحفظ بعض السجلات لتاريخ المشروع أو لأسباب قانونية.',
			},
			{
				heading: 'التواصل',
				body:
					'أسئلة الخصوصية تُرسل إلى بريد التواصل في التذييل.',
			},
		],
	},
	terms: {
		title: 'الشروط والأحكام',
		updated: 'آخر تحديث: نوفمبر 2026',
		sections: [
			{
				heading: 'الخدمات',
				body:
					'تقدّم NEXTSITE خدمات تصميم وتطوير مواقع كما هو موضّح في صفحات الخدمات. يُؤكد النطاق والسعر والجدول لكل مشروع قبل البدء.',
			},
			{
				heading: 'الحجوزات',
				body:
					'إرسال حجز هو طلب وليس عقدًا تلقائيًا. نراجع كل طلب ونؤكد الخطوات التالية. أنت مسؤول عن دقة بيانات التواصل والمشروع.',
			},
			{
				heading: 'المحتوى الذي تقدّمه',
				body:
					'تؤكد أن لديك حقوق النصوص والصور والمواد التي تقدّمها. تبقى مسؤولًا عن دقة ذلك المحتوى.',
			},
			{
				heading: 'التعديلات والتسليم',
				body:
					'تشمل الباقات جولات التعديل المذكورة في صفحة الخدمات. النطاق أو التعديلات الإضافية قد تتطلب عرض سعر محدّث.',
			},
			{
				heading: 'حدود المسؤولية',
				body:
					'بالقدر الذي يسمح به القانون، لا تتحمل NEXTSITE المسؤولية عن خسائر غير مباشرة ناتجة عن استخدام الموقع أو العمل المسلّم. تقتصر المسؤولية المتعلقة بمشروع على الرسوم المدفوعة لذلك المشروع.',
			},
			{
				heading: 'التواصل',
				body:
					'أسئلة الشروط تُرسل إلى بريد التواصل في التذييل.',
			},
		],
	},
	notFound: {
		title: 'الصفحة غير موجودة',
		description:
			'هذه الصفحة غير موجودة أو نُقلت. عد إلى الرئيسية أو ابدأ حجزًا.',
		homeLabel: 'العودة للرئيسية',
		bookingLabel: 'احجز مشروعًا',
	},
	loading: {
		label: 'جاري تحميل NEXTSITE',
	},
	bookingExtras: {
		guestHint:
			'يمكنك الحجز كزائر. أنشئ حسابًا إذا أردت إدارة الحجوزات لاحقًا.',
		accountOptional: 'الحساب اختياري',
		projectType: 'نوع المشروع',
		budgetRange: 'نطاق الميزانية',
		budgetRanges: [
			{ id: 'under-250', label: 'أقل من $250', value: '$200' },
			{ id: '250-400', label: '$250 – $400', value: '$300' },
			{ id: '400-plus', label: '$400+', value: '$500' },
			{ id: 'unsure', label: 'غير متأكد بعد', value: '' },
		],
		budgetCustom: 'أو أدخل مبلغًا مخصصًا',
		honeypotLabel: 'موقع الشركة',
		stepContact: 'التواصل',
		stepProject: 'المشروع',
		stepDetails: 'التفاصيل',
	},
	footerLegal: {
		heading: 'قانوني',
		privacy: 'سياسة الخصوصية',
		terms: 'الشروط',
		faq: 'الأسئلة',
		portfolio: 'الأعمال',
	},
}

/**
 * Marketing copy for upgraded pages and sections.
 */
export const MARKETING_CONTENT: Record<Language, MarketingContent> = {
	en: ENGLISH,
	ar: ARABIC,
}
