'use server'
import { cookies } from "next/headers"


export const getCookies =async()=>{
const cookie = (await cookies()).get('accessToken')?.value ?? null
return cookie
}

export const getAdminCookies =async()=>{
const cookie = (await cookies()).get('adminToken')?.value ?? null
return cookie
}

export const deleteCookies = async()=>{
    (await cookies()).delete('accessToken')
return true
} 

export const deleteAdminCookies = async()=>{
     (await cookies()).delete('adminToken')
return true
} 