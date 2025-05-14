// components/layout/navbar.js
"use client"
import { Bell, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

const Navbar = () => {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex h-16 items-center justify-between border-b border-principal-400/30 px-6 bg-principal-100">
      <div className="flex items-center gap-x-4">
        <h1 className="text-xl font-medium text-secondary">Bienvenido, Jirvin</h1>
      </div>
      <div className="flex items-center gap-x-4">
        <Button variant="ghost" size="icon" className="text-secondary-600 hover:text-accent hover:bg-principal-200">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-secondary-600 hover:text-accent hover:bg-principal-200">
              { theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              ) }
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-principal-100 border border-principal-400/30">
            <DropdownMenuItem onClick={ () => setTheme("light") } className="text-secondary-600 hover:text-secondary focus:text-secondary hover:bg-principal-200">
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={ () => setTheme("dark") } className="text-secondary-600 hover:text-secondary focus:text-secondary hover:bg-principal-200">
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={ () => setTheme("system") } className="text-secondary-600 hover:text-secondary focus:text-secondary hover:bg-principal-200">
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Navbar