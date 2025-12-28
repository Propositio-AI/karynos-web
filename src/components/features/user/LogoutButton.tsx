'use client'

import { signOut } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import { logoutAction } from '@/lib/auth/logout'

const LogoutButton = () => {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await signOut() 
            
            await logoutAction()

            router.push('/login')
            router.refresh() // キャッシュクリアのためにrefresh推奨

        } catch (error) {
            console.error('Logout error', error)
        }
    }

    return (
        <button onClick={handleLogout}>
        ログアウト
        </button>
    )
}

export default LogoutButton;