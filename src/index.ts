import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'Express API for JSONPlaceholder',
		version: '1.0.0',
		description:
			'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
		license: {
			name: 'Licensed Under MIT',
			url: 'https://spdx.org/licenses/MIT.html',
		},
		contact: {
			name: 'JSONPlaceholder',
			url: 'https://jsonplaceholder.typicode.com',
		},
	},
	servers: [
		{
			url: 'http://localhost:8080',
			description: 'Development server',
		},
	],
}

const options = {
	swaggerDefinition,
	// Paths to files containing OpenAPI definitions
	apis: ['./src/index.ts'],
}
const swaggerSpec = swaggerJSDoc(options)

dotenv.config({ path: '.env.local' })
const app = express()

app.use(
	cors({
		credentials: true,
	})
)

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const server = http.createServer(app)

server.listen(8080, () => {
	console.log('Server started on port 8080')
})

// POST /user

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     description: Retrieve a name, email, and ID to create a new user.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The user ID.
 *                 example: 0
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 example: Leanne Graham
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: 9K5g8@example.com
 *       required: true
 *     responses:
 *       200:
 *         description: Successful user creation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The user ID.
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *                       email:
 *                         type: string
 *                         description: The user's email.
 *                         example: 9K5g8@example.com
 */
app.post('/user', (req, res) => {
	const { id, name, email } = req.body
	// Store the user data in a database or a temporary storage
	const userData = { id, name, email }
	// For demonstration purposes, we'll store it in a simple object
	const users: { [key: string]: any } = {}
	users[id] = userData
	res.json({ message: 'User created successfully', data: users[id] })
})

// POST /user/:id/data

/**
 * @swagger
 * /user/{id}/data:
 *   post:
 *     summary: Send user data to Zapier.
 *     description: Send user data to a Zapier webhook to trigger an action/process data.
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         description: The user ID.
 *         example: 0
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The user ID.
 *                 example: 0
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 example: Leanne Graham
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: 9K5g8@example.com
 *       required: true
 *     responses:
 *       200:
 *         description: Data posted to Zapier successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data posted successfully
 *                 data:
 *                   type: object
 *                   description: The user data that was posted.
 *                   example:
 *                     id: 0
 *                     name: Leanne Graham
 *                     email: 9K5g8@example.com
 */
app.post('/user/:id/data', (req, res) => {
	const { id } = req.params
	const data = req.body
	// Store the data associated with the user
	const users: { [key: string]: any } = {}
	if (!users[id]) {
		users[id] = {}
	}
	users[id].data = data
	// Trigger a webhook to Zapier
	const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL
	const zapierData = { id, data }
	// Use a library like axios to send a POST request to the Zapier webhook
	axios
		.post(zapierWebhookUrl, zapierData)
		.then(() => {
			res.json({ message: 'Data posted successfully', data: users[id].data })
		})
		.catch((error: any) => {
			console.error(error)
			res.status(500).json({ message: 'Error posting data' })
		})
})

// GET /user/:id/data

/**
 * @swagger
 * /user/{id}/data:
 *   get:
 *     summary: Get user data.
 *     description: Retrieve the data associated with the user.
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         description: The user ID.
 *         example: 0
 *         required: true
 *     responses:
 *       200:
 *         description: Return found user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: The user's data.
 *                   example:
 *                     id: 0
 *                     name: Leanne Graham
 *                     email: 9K5g8@example.com
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found.
 *
 */
app.get('/user/:id/data', (req, res) => {
	const { id } = req.params
	// Retrieve the data associated with the user
	const users: { [key: string]: any } = {
		'0': {
			data: { id: '0', name: 'Dummy Data', email: '9K5g8@example.com' },
		},
	}

	if (!users[id]) {
		res.status(404).json({ message: 'User not found' })
	} else {
		const data = users[id].data
		res.json(data)
	}
})
