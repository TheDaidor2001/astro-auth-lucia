import type { APIContext } from "astro";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

import { db, User } from "astro:db";
import { lucia } from "@/auth";

export async function POST(context: APIContext) : Promise<Response> {
    
    //parse form Data
    const formData = await context.request.formData()

    const email = formData.get('email')
    const password = formData.get('password')

    //validate the data
    if(!email || !password) {
        return new Response('Username and Password are required', {status: 400})
    }

    if(typeof email !== 'string' || email.length < 4) {
        return new Response('Username must be at least 4 characters long', {status: 400})
    }

    if(typeof password !== 'string' || password.length < 4) {
        return new Response('Password must be at least 4 characters long', {status: 400})
    }

    //Insert user in db
    const userId = generateId(15)
    const hashPassword = await new Argon2id().hash(password)


    await db.insert(User).values({
        id: userId,
        email,
        password: hashPassword
    })

    //Generate session
    const session = lucia.createSession(userId,{})
    const sessionCookie = lucia.createSessionCookie( (await session).id)
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return context.redirect('/')

}




