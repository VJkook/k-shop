import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { siteName, titleMerge } from '@/config/seo.config'
import { onlyText } from '../string/clearText'
import { ISeo } from '@/utils/meta/mete.interface'
const Meta: FC<ISeo> = ({ title, description, image, children }) => {
	const { asPath } = useRouter()
	const currentUrl = `${process.env.NEXT_PUBLIC_URL}${asPath}`
	const imageUrl = `https://telebon.ru/preview/${image}`
	return (
		<>
			{description ? (
				<Head>
					<title itemProp="headline">{titleMerge(title)}</title>
					<meta
						itemProp="description"
						name="description"
						content={onlyText(description, 152)}
					/>
					<link data-rel="canonical" href={currentUrl} />
					<link rel="canonical" href={currentUrl} />
					<meta name="keywords" content="" />
					<meta property="og:type" content="website" />
					<meta property="og:locale" content="ru" />
					<meta property="og:title" content={titleMerge(title)} />
					<meta property="og:url" content={currentUrl} />
					<meta property="og:site_name" content={siteName} />
					<meta
						property="og:description"
						content={onlyText(description, 197)}
					/>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
				</Head>
			) : (
				<meta name="robots" content="noindex, nofollow" />
			)}
			{children}
		</>
	)
}

export default Meta
