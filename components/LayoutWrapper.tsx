import localFont from 'next/font/local'
import SectionContainer from './SectionContainer'
import { ReactNode } from 'react'
import Header from './Header'

interface Props {
  children: ReactNode
}

// Self-hosted copies of the Google Fonts files next/font/google used to fetch, so builds don't depend on reaching Google Fonts.
const inter = localFont({
  src: '../app/fonts/inter-latin.woff2',
  weight: '100 900',
  display: 'swap',
})

const LayoutWrapper = ({ children }: Props) => {
  return (
    <SectionContainer>
      <div className={`${inter.className} flex h-screen flex-col justify-between font-sans`}>
        <Header />
        <main className="mb-auto">{children}</main>
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
