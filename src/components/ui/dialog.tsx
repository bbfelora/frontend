import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

function useDialog() {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a Dialog')
  }
  return context
}

export function Dialog({ 
  children, 
  open, 
  onOpenChange 
}: { 
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <DialogContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ 
  children, 
  asChild = false,
  ...props 
}: { 
  children: React.ReactNode
  asChild?: boolean
} & React.HTMLAttributes<HTMLElement>) {
  const { setOpen } = useDialog()
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e)
        setOpen(true)
      }
    })
  }
  
  return (
    <button {...props} onClick={() => setOpen(true)}>
      {children}
    </button>
  )
}

export function DialogContent({ 
  children, 
  className,
  ...props 
}: { 
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = useDialog()
  
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />
      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center p-6 pointer-events-none">
        <div 
          className={cn(
            "relative bg-background rounded-lg shadow-xl border max-w-lg w-full max-h-[90vh] overflow-y-auto pointer-events-auto",
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}

export function DialogHeader({ 
  children, 
  className,
  ...props 
}: { 
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-0", className)} {...props}>
      {children}
    </div>
  )
}

export function DialogTitle({ 
  children, 
  className,
  ...props 
}: { 
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h3>
  )
}

export function DialogDescription({ 
  children, 
  className,
  ...props 
}: { 
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
}

export function DialogFooter({ 
  children, 
  className,
  ...props 
}: { 
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
}