import React from 'react'
import Image from 'next/image'
import { Input } from './ui/input'
import { Search, HistoryIcon, DoorOpen } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { getUser } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu'
import { LogoutButton } from './logout-button'
import Cart from './Cart'

const Header = async () => {
  const user = await getUser()
  return (
    <header className='flex px-3 py-1 h-16 justify-around items-center'>
        <Image src="/logo.png" alt="Logo" className='h-12 w-12' width={100} height={100} />
        <div className='flex items-center flex-1 justify-center relative gap-2'>
            <Input className='w-1/2' placeholder="Search" />
            <Search className='absolute  right-2 top-1/2 -translate-y-1/2'/>
        </div>
        <div className='flex gap-2 items-center'>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarFallback>{user.user_metadata.name.split(" ")[0].substring(0, 1).toUpperCase()}</AvatarFallback>
                    <AvatarImage src={user.user_metadata.avatar_url} />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem> <Link href="/auth/history"><HistoryIcon className="mr-2 h-4 w-4" /> History</Link></DropdownMenuItem>
                  <DropdownMenuItem><DoorOpen className="mr-2 h-4 w-4" /> <LogoutButton/></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <Link href="/auth/login">
                    <Button>Login</Button>
                </Link>
            )}
            <Cart/>
        </div>
    </header>
  )
}

export default Header