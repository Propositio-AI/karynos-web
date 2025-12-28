'use server'

import { cookies } from 'next/headers'

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('id_token') 
  cookieStore.delete('access_token') // もし保存していれば
}