import * as React from "react"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  expanded: boolean
}>({
  expanded: true
})

export function useSidebar() {
  return React.useContext(SidebarContext)
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  expanded?: boolean
}

export function Sidebar({
  expanded = true,
  className,
  children,
  ...props
}: SidebarProps) {
  return (
    <SidebarContext.Provider value={{ expanded }}>
      <div
        data-expanded={expanded}
        className={cn(
          "h-full border-r bg-background transition-all duration-300 data-[expanded=true]:w-64 data-[expanded=false]:w-16",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export interface SidebarContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({
  className,
  children,
  ...props
}: SidebarContentProps) {
  return (
    <div
      className={cn("flex h-full flex-col gap-4 p-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface SidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarHeader({
  className,
  children,
  ...props
}: SidebarHeaderProps) {
  const { expanded } = useSidebar()

  return (
    <div
      data-expanded={expanded}
      className={cn(
        "flex h-14 items-center gap-2 px-4 data-[expanded=false]:justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface SidebarHeaderTitleProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarHeaderTitle({
  className,
  children,
  ...props
}: SidebarHeaderTitleProps) {
  const { expanded } = useSidebar()

  if (!expanded) {
    return null
  }

  return (
    <div className={cn("font-semibold", className)} {...props}>
      {children}
    </div>
  )
}

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroup({
  className,
  children,
  ...props
}: SidebarGroupProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {children}
    </div>
  )
}

export interface SidebarGroupLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupLabel({
  className,
  children,
  ...props
}: SidebarGroupLabelProps) {
  const { expanded } = useSidebar()

  if (!expanded) {
    return null
  }

  return (
    <div
      className={cn("px-2 text-xs font-semibold tracking-tight", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface SidebarGroupContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupContent({
  className,
  children,
  ...props
}: SidebarGroupContentProps) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  )
}

export interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenu({ className, children, ...props }: SidebarMenuProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

export interface SidebarMenuItemProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenuItem({
  className,
  children,
  ...props
}: SidebarMenuItemProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function SidebarMenuButton({
  className,
  asChild = false,
  ...props
}: SidebarMenuButtonProps) {
  const { expanded } = useSidebar()
  const Comp = asChild ? React.Fragment : "button"

  return (
    <Comp
      data-expanded={expanded}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground data-[expanded=false]:justify-center",
        className
      )}
      {...props}
    />
  )
}