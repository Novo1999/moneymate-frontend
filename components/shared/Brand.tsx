
import MoneyMateLogo from '@/assets/moneymate_logo.png';
import Image from 'next/image';
import Link from 'next/link';

const Brand = ({ className, link = '/' }: { className?: string; link?: string }) => {
  return (
    <Link href={link}>
      <Image src={MoneyMateLogo} className={className} alt="moneymate" width={1000} height={1000} />
    </Link>
  )
}
export default Brand
