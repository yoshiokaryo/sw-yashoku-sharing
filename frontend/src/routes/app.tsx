import { Hono } from "hono"
import { AppTop } from "../pages/app-top"

const app = new Hono()

// Guard: 未認証時はクライアント側で / または /auth/login へリダイレクトする（AppTop にスクリプトで実装）
app.get("/", (c) => c.html(AppTop()))
app.get("/suggest", (c) => c.html(AppTop())) // 006: プレースホルダ

export default app
