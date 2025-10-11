import {inngest} from "@/lib/inngest/client"

export const sendSigUpEmail = inngest.createFunction(
    {id: 'sign-up-email'},
    {event: 'app/user.created'},
)