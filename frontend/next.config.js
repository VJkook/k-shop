/** @type {import('next').NextConfig} */
const nextConfig = {
	poweredByHeader: false,
	reactStrictMode: false,
	swcMinify: true,
	images: {
		// formats: ['image/avif', 'image/webp'],
        domains: ['localhost'],
	},
}

module.exports = nextConfig
