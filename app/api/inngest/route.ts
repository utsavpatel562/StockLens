import { inngest } from "@/lib/inngest/client"
import { sendSigUpEmail } from "@/lib/inngest/functions"
import {serve} from "inngest/next"

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [sendSigUpEmail],
})