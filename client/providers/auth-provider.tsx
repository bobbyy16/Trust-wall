"use client"

import type React from "react"

import { AuthProvider as AuthContextProvider } from "@/hooks/use-auth"

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <AuthContextProvider>{children}</AuthContextProvider>
}
