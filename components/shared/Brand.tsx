import MoneyMateLogo from '@/assets/moneymate_logo.png'
import { useSidebar } from '@/components/ui/sidebar'
import Image from 'next/image'
import Link from 'next/link'

const Brand = ({ className, link = '/' }: { className?: string; link?: string }) => {
  const { setOpenMobile } = useSidebar()

  return (
    <Link onClick={() => setOpenMobile(false)} href={link}>
      <Image src={MoneyMateLogo} className={className} alt="moneymate" width={1000} height={1000} />
    </Link>
  )
}
export default Brand
