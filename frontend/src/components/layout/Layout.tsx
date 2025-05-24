import { FC } from 'react'
import { IType } from '@/shared/types/option.types'
import Header from '@/components/layout/header/Header'
import Footer from '@/components/layout/footer/Footer'
import styles from './Layout.module.scss'

const Layout: FC<IType> = ({ children }) => {
    return (
        <div className={styles.layout}>
            <Header />
            <main className={styles.content}>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout
