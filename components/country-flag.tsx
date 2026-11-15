interface CountryFlagProps {
	code: string
	name: string
	className?: string
}

/**
 * Renders a real flag image so Windows does not show "LB" text.
 */
export function CountryFlag ({
	code,
	name,
	className = 'h-4 w-6',
}: CountryFlagProps) {
	const src =
		'https://flagcdn.com/w40/'
		+ code.toLowerCase()
		+ '.png'

	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={src}
			alt=""
			title={name}
			width={40}
			height={30}
			loading="lazy"
			decoding="async"
			className={[
				'rounded-sm object-cover',
				className,
			].join(' ')}
		/>
	)
}
