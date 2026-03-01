import { Hono } from "hono"
import { AuthLogin } from "../pages/auth-login"
import { AuthSignup } from "../pages/auth-signup"
import { AuthCallback } from "../pages/auth-callback"

const auth = new Hono()

auth.get("/login", (c) => c.html(AuthLogin()))
auth.get("/signup", (c) => c.html(AuthSignup()))
auth.get("/callback", (c) => c.html(AuthCallback()))

export default auth
