const PHOTO_PREFIX = 'data:image/jpeg;base64,'
const PHOTO_MAX = 80_000

/**
 * True when the value is a small JPEG profile photo.
 */
export function isProfilePhoto (value: unknown): value is string {
	return typeof value === 'string'
		&& value.startsWith(PHOTO_PREFIX)
		&& value.length <= PHOTO_MAX
		&& /^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(value)
}
