import { Hono } from 'hono'
import { LP } from './pages/lp'
import authRoutes from './routes/auth'
import appRoutes from './routes/app'
import { layoutMiddleware } from './middleware/layout'

const app = new Hono()

app.use('*', layoutMiddleware)

app.get('/', (c) => c.render(<LP />))

app.route('/auth', authRoutes)
app.route('/app', appRoutes)

export default app