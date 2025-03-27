import { FC } from 'react'

import Layout from '@/components/layout/Layout'

import { TypeComponentAuthFields } from '@/shared/types/auth.types'
import HeadProvider from './head-provider/HeadProvider'

const MainProvider: FC<TypeComponentAuthFields> = ({
	children,
	Component,
}: any) => {
	return (
		<HeadProvider>
			<Layout>{children}</Layout>
		</HeadProvider>
	)
}

export default MainProvider
