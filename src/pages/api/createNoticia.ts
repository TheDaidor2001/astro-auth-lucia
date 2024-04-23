import type { APIContext, APIRoute } from "astro";
import { db, Blog } from "astro:db";
import { v4 as uuidv4 } from 'uuid'


export const POST: APIRoute = async ({request}): Promise<Response> =>  {

    const data = await request.json()
    

    if(!data) {
       throw new Error("Missing fields")
    }

    
    await db.insert(Blog).values(data)
    console.log(data);
    
    
    return new Response(JSON.stringify(data), {status: 200})
}