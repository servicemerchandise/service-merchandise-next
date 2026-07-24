import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

export function Logo({ variant = 'dark', size = 'md', withText = true }: LogoProps) {
  const sizes = {
    sm: { box: 'h-8', img: 32, text: 'text-base' },
    md: { box: 'h-10', img: 40, text: 'text-2xl' },
    lg: { box: 'h-14', img: 56, text: 'text-2xl' },
  };
  const c = sizes[size];
  const colorText = variant === 'light' ? 'text-white' : 'text-sm-700';

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className={`${c.box} relative flex items-center justify-center`}>
        {/* Logo real del cliente: Service Merchandise */}
        <Image
          src="/logo.png"
          alt="Service Merchandise"
          width={c.img * 2}
          height={c.img * 2}
          className="h-full w-auto object-contain"
          priority
        />
      </div>
      {withText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-display font-bold ${c.text} ${colorText} tracking-tight`}>
            Service Merchandise
          </span>
          <span className={`text-[10px] tracking-[0.25em] uppercase ${variant === 'light' ? 'text-sm-100' : 'text-sm-400'}`}>
            Marketplace B2B
          </span>
        </div>
      )}
    </Link>
  );
}
