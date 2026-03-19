'use client'
import MoneyMateLogo from '@/assets/moneymate_logo.png'
import Image from 'next/image'
import Link from 'next/link'

type Props = { className?: string; link?: string; setOpenMobile?: (open: boolean) => void }

const Brand = ({ className, link = '/', setOpenMobile }: Props) => {
  return (
    <Link onClick={() => setOpenMobile?.(false)} href={link}>
      <Image src={MoneyMateLogo} className={className} alt="moneymate" width={1000} height={1000} />
    </Link>
  )
}
export default Brand
