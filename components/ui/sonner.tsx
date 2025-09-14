"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        unstyled: false,
        classNames: {
          success: "!bg-gradient-to-r !from-green-600 !to-emerald-600 !text-white !border-green-600",
          error: "!bg-gradient-to-r !from-red-600 !to-red-700 !text-white !border-red-600",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
