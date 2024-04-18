import { lucia } from "@/auth";
import type { APIContext } from "astro";
import { db, eq, User } from "astro:db";
import { Argon2id } from "oslo/password";

export async function POST(context: APIContext): Promise<Response> {

    const formData = await context.request.formData();

    const email = formData.get("email");
    const password = formData.get("password");

    //validar los datos
    if(typeof email !== "string" || typeof password !== "string"){
        return new Response("Invalid form data", {status: 400});
    }

    //Search the user
    const foundUser = (await db.select().from(User).where(eq(User.email, email))).at(0);

    //if User not found
    if(!foundUser){
        return new Response("Incorrect email or password", {status: 404});
    }

    //verify password
    if(!foundUser.password){
        return new Response("Invalid password", {status: 400});
    }

    const isValid = await new Argon2id().verify(foundUser.password, password);

    //If password is not valid
    if(!isValid){
        return new Response("Incorrect email or password", {status: 400});
    }


    // All ok, user can signin
    const session = lucia.createSession(foundUser.id, {});
    const sessionCookie = lucia.createSessionCookie((await session).id);
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return context.redirect('/')

}
