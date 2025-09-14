import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'white' | 'minimal'
  className?: string
}

const sizeConfig = {
  sm: { container: 'w-6 h-6', text: 'text-xs' },
  md: { container: 'w-8 h-8', text: 'text-sm' },
  lg: { container: 'w-12 h-12', text: 'text-lg' },
  xl: { container: 'w-16 h-16', text: 'text-xl' }
}

export function Logo({ size = 'md', variant = 'default', className = '' }: LogoProps) {
  const config = sizeConfig[size]
  
  const getStyles = () => {
    switch (variant) {
      case 'white':
        return {
          container: 'bg-white shadow-md',
          icon: 'text-primary-600',
          gradient: 'from-white to-gray-50'
        }
      case 'minimal':
        return {
          container: 'bg-transparent border-2 border-primary-500',
          icon: 'text-primary-500',
          gradient: 'from-transparent to-transparent'
        }
      default:
        return {
          container: 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg',
          icon: 'text-accent-500',
          gradient: 'from-primary-500 to-primary-600'
        }
    }
  }

  const styles = getStyles()

  return (
    <div className={`${config.container} rounded-xl flex items-center justify-center relative overflow-hidden ${styles.container} ${className}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-full h-full">
          <div className="w-2 h-2 bg-white rounded-full absolute top-1 right-1 opacity-30"></div>
          <div className="w-1 h-1 bg-white rounded-full absolute bottom-1 left-1 opacity-20"></div>
        </div>
      </div>
      
      {/* Custom Felora Logo SVG */}
      <svg 
        viewBox="0 0 32 32" 
        className={`relative z-10 ${config.text.includes('xs') ? 'w-4 h-4' : config.text.includes('sm') ? 'w-5 h-5' : config.text.includes('lg') ? 'w-7 h-7' : config.text.includes('xl') ? 'w-10 h-10' : 'w-6 h-6'}`}
        fill="none"
      >
        {/* Main geometric F shape */}
        <path 
          d="M8 6h16v4H12v4h12v4H12v8H8V6z" 
          fill="currentColor"
          className={styles.icon}
        />
        
        {/* Decorative geometric elements */}
        <circle 
          cx="24" 
          cy="8" 
          r="2" 
          fill="currentColor"
          className={`${styles.icon} opacity-70`}
        />
        
        <rect 
          x="26" 
          y="12" 
          width="3" 
          height="3" 
          fill="currentColor"
          className={`${styles.icon} opacity-50`}
        />
        
        {/* Connection lines */}
        <path 
          d="M24 10v2M26 15h2" 
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={`${styles.icon} opacity-60`}
        />
      </svg>
      
      {/* Subtle highlight */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl"></div>
    </div>
  )
}

interface LogoWithTextProps extends LogoProps {
  showText?: boolean
  textSize?: 'sm' | 'md' | 'lg' | 'xl'
}

export function LogoWithText({ 
  size = 'md', 
  variant = 'default', 
  className = '',
  showText = true,
  textSize = 'lg'
}: LogoWithTextProps) {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Logo size={size} variant={variant} />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-primary-500 leading-none ${textSizes[textSize]}`}>
            Felora
          </span>
          <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
            Portal
          </span>
        </div>
      )}
    </div>
  )
}