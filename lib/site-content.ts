import { type Language } from '@/lib/language'

export interface NavContent {
	home: string
	aboutUs: string
	booking: string
	bookNow: string
	menu: string
	close: string
	primary: string
	toggleLanguage: string
	english: string
	arabic: string
}

export interface HeroContent {
	eyebrow: string
	title: string
	description: string
	ctaLabel?: string
}

export interface ServiceItemContent {
	id: string
	title: string
	description: string
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
	nav: NavContent
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
	}
	booking: {
		hero: HeroContent
		form: {
			eyebrow: string
			title: string
			description: string
			fullName: string
			fullNamePlaceholder: string
			fullNameError: string
			website: string
			websitePlaceholder: string
			websiteError: string
			submit: string
			submitting: string
			confirmed: string
			whatsAppTitle: string
			whatsAppName: string
			whatsAppDescription: string
		}
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
	nav: {
		home: 'Home',
		aboutUs: 'About Us',
		booking: 'Booking',
		bookNow: 'Book Now',
		menu: 'Menu',
		close: 'Close',
		primary: 'Primary',
		toggleLanguage: 'Toggle language',
		english: 'EN',
		arabic: 'AR',
	},
	home: {
		hero: {
			brand: 'NEXTSITE',
			title: 'Websites designed around your ideas.',
			description:
				'Landing pages, static sites, and personal brands — built modern, fast, and unmistakably yours.',
			ctaLabel: 'Book Now',
			secondaryCtaLabel: 'View Services',
		},
		services: {
			eyebrow: 'Services',
			title: 'What I Offer',
			description:
				'Professional websites designed to bring your ideas to life.',
			bookNow: 'Book Now',
			items: [
				{
					id: 'landing-page',
					title: 'Landing Page',
					description:
						'A focused, high-converting single-page site for businesses, products, or campaigns — clean, modern, and fully responsive.',
					priceLabel: 'Starting from $200',
				},
				{
					id: 'static-website',
					title: 'Static Website',
					description:
						'A professional multi-page website for businesses, portfolios, or organizations — fast, modern, and built to last.',
					priceLabel: 'Starting from $300',
				},
				{
					id: 'personal-website',
					title: 'Personal Website',
					description:
						'A personalized site for creators and professionals — designed to showcase your work, skills, and personal brand.',
					priceLabel: 'Starting from $250',
				},
			],
		},
		whyChooseUs: {
			eyebrow: 'Why Us',
			title: 'Why Choose Us?',
			description:
				'More than just a website — we build a digital presence designed around you.',
			items: [
				{
					id: 'custom-designs',
					title: 'Built for Your Brand',
					description:
						'Every website is designed specifically for your brand, goals, and style — never just a generic template.',
				},
				{
					id: 'fully-responsive',
					title: 'Looks Great Everywhere',
					description:
						'Every website is optimized to work smoothly and look great on phones, tablets, and desktops.',
				},
				{
					id: 'fast-modern',
					title: 'Fast. Clean. Professional.',
					description:
						'Modern, lightweight websites built with a focus on fast loading speeds and a smooth user experience.',
				},
				{
					id: 'personal-support',
					title: 'We’re Here for You',
					description:
						'Clear communication and personal support throughout the project, from the first idea to the final website.',
				},
			],
		},
		bookingCta: {
			eyebrow: 'Next Step',
			title: 'Ready to Build Your Website?',
			description:
				'Let’s bring your idea to life with a modern website designed for you.',
			ctaLabel: 'Book Now',
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
	},
	booking: {
		hero: {
			eyebrow: '03 Book',
			title: 'Ready to start your website?',
			description:
				'Share your project details below and reach us directly on WhatsApp. We will review your request and get back to you to discuss the next steps.',
		},
		form: {
			eyebrow: 'Get Started',
			title: 'Book Now',
			description:
				'Tell us about your website and we’ll get back to you to discuss the details.',
			fullName: 'Full Name',
			fullNamePlaceholder: 'Enter your full name',
			fullNameError: 'Please enter your full name.',
			website: 'Tell us about your website',
			websitePlaceholder:
				'Describe the website you need, including its purpose, pages, features, or any ideas you have...',
			websiteError: 'Please tell us about your website.',
			submit: 'Submit Booking',
			submitting: 'Opening WhatsApp...',
			confirmed:
				'Your booking details are ready in WhatsApp. Please press Send to complete your request.',
			whatsAppTitle: 'New Website Booking',
			whatsAppName: 'Full Name',
			whatsAppDescription: 'Website Description',
		},
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
			{ href: '/#services', label: 'Services' },
			{ href: '/booking', label: 'Booking' },
		],
		serviceLinks: [
			{ href: '/#services', label: 'Landing Pages' },
			{ href: '/#services', label: 'Static Websites' },
			{ href: '/#services', label: 'Personal Websites' },
		],
	},
}

const ARABIC: SiteContent = {
	skipToContent: 'تخطّ إلى المحتوى',
	themeToggle: 'تبديل مظهر الألوان',
	nav: {
		home: 'الرئيسية',
		aboutUs: 'من نحن',
		booking: 'الحجز',
		bookNow: 'احجز الآن',
		menu: 'القائمة',
		close: 'إغلاق',
		primary: 'رئيسي',
		toggleLanguage: 'تبديل اللغة',
		english: 'EN',
		arabic: 'AR',
	},
	home: {
		hero: {
			brand: 'NEXTSITE',
			title: 'مواقع مصمّمة حول أفكارك.',
			description:
				'صفحات هبوط ومواقع ثابتة وهويّات شخصية — حديثة وسريعة وبصمتك أنت.',
			ctaLabel: 'احجز الآن',
			secondaryCtaLabel: 'عرض الخدمات',
		},
		services: {
			eyebrow: 'الخدمات',
			title: 'ماذا نقدّم',
			description:
				'مواقع احترافية مصمّمة لتحويل أفكارك إلى واقع.',
			bookNow: 'احجز الآن',
			items: [
				{
					id: 'landing-page',
					title: 'صفحة هبوط',
					description:
						'موقع من صفحة واحدة مركّز وعالي التحويل للأعمال أو المنتجات أو الحملات — نظيف وحديث ومتجاوب بالكامل.',
					priceLabel: 'يبدأ من 200 دولار',
				},
				{
					id: 'static-website',
					title: 'موقع ثابت',
					description:
						'موقع احترافي متعدّد الصفحات للشركات أو المعارض أو المؤسسات — سريع وحديث ومبني ليدوم.',
					priceLabel: 'يبدأ من 300 دولار',
				},
				{
					id: 'personal-website',
					title: 'موقع شخصي',
					description:
						'موقع مخصّص للمبدعين والمحترفين — مصمّم لإبراز عملك ومهاراتك وعلامتك الشخصية.',
					priceLabel: 'يبدأ من 250 دولار',
				},
			],
		},
		whyChooseUs: {
			eyebrow: 'لماذا نحن',
			title: 'لماذا تختارنا؟',
			description:
				'أكثر من مجرد موقع — نبني حضوراً رقمياً مصمّماً حولك.',
			items: [
				{
					id: 'custom-designs',
					title: 'مصمّم لعلامتك',
					description:
						'كل موقع يُصمَّم خصيصاً لعلامتك وأهدافك وأسلوبك — وليس قالباً عاماً.',
				},
				{
					id: 'fully-responsive',
					title: 'يبدو رائعاً في كل مكان',
					description:
						'كل موقع محسّن ليعمل بسلاسة ويظهر بشكل ممتاز على الهاتف والجهاز اللوحي والحاسوب.',
				},
				{
					id: 'fast-modern',
					title: 'سريع. نظيف. احترافي.',
					description:
						'مواقع حديثة وخفيفة تركّز على سرعة التحميل وتجربة استخدام سلسة.',
				},
				{
					id: 'personal-support',
					title: 'نحن معك',
					description:
						'تواصل واضح ودعم شخصي طوال المشروع، من الفكرة الأولى حتى الموقع النهائي.',
				},
			],
		},
		bookingCta: {
			eyebrow: 'الخطوة التالية',
			title: 'جاهز لبناء موقعك؟',
			description:
				'لنحوّل فكرتك إلى موقع حديث مصمّم لأجلك.',
			ctaLabel: 'احجز الآن',
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
	},
	booking: {
		hero: {
			eyebrow: '03 احجز',
			title: 'جاهز لبدء موقعك؟',
			description:
				'شارك تفاصيل مشروعك أدناه وتواصل معنا مباشرة عبر واتساب. سنراجع طلبك ونعود إليك لمناقشة الخطوات التالية.',
		},
		form: {
			eyebrow: 'ابدأ الآن',
			title: 'احجز الآن',
			description:
				'أخبرنا عن موقعك وسنعود إليك لمناقشة التفاصيل.',
			fullName: 'الاسم الكامل',
			fullNamePlaceholder: 'أدخل اسمك الكامل',
			fullNameError: 'يرجى إدخال اسمك الكامل.',
			website: 'أخبرنا عن موقعك',
			websitePlaceholder:
				'صف الموقع الذي تحتاجه، بما في ذلك الغرض والصفحات والميزات أو أي أفكار لديك...',
			websiteError: 'يرجى إخبارنا عن موقعك.',
			submit: 'إرسال الحجز',
			submitting: 'جاري فتح واتساب...',
			confirmed:
				'تفاصيل حجزك جاهزة في واتساب. يرجى الضغط على إرسال لإكمال طلبك.',
			whatsAppTitle: 'حجز موقع جديد',
			whatsAppName: 'الاسم الكامل',
			whatsAppDescription: 'وصف الموقع',
		},
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
			{ href: '/#services', label: 'الخدمات' },
			{ href: '/booking', label: 'الحجز' },
		],
		serviceLinks: [
			{ href: '/#services', label: 'صفحات الهبوط' },
			{ href: '/#services', label: 'المواقع الثابتة' },
			{ href: '/#services', label: 'المواقع الشخصية' },
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
