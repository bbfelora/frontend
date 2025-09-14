import React from 'react'

interface FeloraLogoProps {
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

export function FeloraLogo({ size = 'md', variant = 'default', className = '' }: FeloraLogoProps) {
  const config = sizeConfig[size]
  
  const getStyles = () => {
    switch (variant) {
      case 'white':
        return 'bg-white text-primary-600 shadow-sm border border-gray-200'
      case 'minimal':
        return 'bg-transparent text-primary-500 border-2 border-primary-500'
      default:
        return 'bg-gradient-to-br from-primary-500 to-primary-600 text-accent-500 shadow-sm'
    }
  }

  return (
    <div className={`${config.container} rounded-lg flex items-center justify-center ${getStyles()} ${className}`}>
      <svg 
        viewBox="0 0 24 24" 
        className="w-2/3 h-2/3"
        fill="currentColor"
      >
        {/* Clean, modern F */}
        <path d="M7 3h10a1 1 0 0 1 0 2H9v6h6a1 1 0 0 1 0 2H9v8a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1z"/>
      </svg>
    </div>
  )
}

interface FeloraLogoWithTextProps extends FeloraLogoProps {
  showText?: boolean
  textSize?: 'sm' | 'md' | 'lg' | 'xl'
  showSubtitle?: boolean
}

export function FeloraLogoWithText({ 
  size = 'md', 
  variant = 'default', 
  className = '',
  showText = true,
  textSize = 'lg',
  showSubtitle = true
}: FeloraLogoWithTextProps) {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <FeloraLogo size={size} variant={variant} />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-primary-500 leading-none ${textSizes[textSize]}`}>
            Felora
          </span>
          {showSubtitle && (
            <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
              Portal
            </span>
          )}
        </div>
      )}
    </div>
  )
}