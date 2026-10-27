import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const html = fs.readFileSync(path.join(root, 'ui-motion.html'))
const stills = path.join(root, 'stills')
const profile = path.join(root, '.edge-profile')

const server = http.createServer((request, response) => {
	response.writeHead(200, {
		'content-type': 'text/html; charset=utf-8',
	})
	response.end(html)
})

await new Promise((resolve) => {
	server.listen(8765, '127.0.0.1', resolve)
})

const edge = spawn(
	'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
	[
		'--headless=new',
		'--disable-gpu',
		'--hide-scrollbars',
		'--force-device-scale-factor=1',
		'--remote-debugging-port=9223',
		`--user-data-dir=${profile}`,
		'--window-size=1920,1080',
		'about:blank',
	],
	{ stdio: 'ignore' },
)

async function browserVersion () {
	for (let attempt = 0; attempt < 40; attempt += 1) {
		try {
			const response = await fetch('http://127.0.0.1:9223/json/version')
			if (response.ok) return response.json()
		} catch (error) {
			void error
		}
		await new Promise((resolve) => setTimeout(resolve, 250))
	}
	throw new Error('Edge did not open a debugging port.')
}

const version = await browserVersion()
const browser = new WebSocket(version.webSocketDebuggerUrl)
let nextId = 0
const pending = new Map()

function send (method, params, sessionId) {
	const id = ++nextId
	const payload = { id, method, params }
	if (sessionId) payload.sessionId = sessionId
	return new Promise((resolve, reject) => {
		pending.set(id, { resolve, reject })
		browser.send(JSON.stringify(payload))
	})
}

await new Promise((resolve, reject) => {
	if (browser.readyState === WebSocket.OPEN) {
		resolve()
		return
	}
	browser.addEventListener('open', resolve)
	browser.addEventListener('error', reject)
})

browser.addEventListener('message', (event) => {
	const message = JSON.parse(event.data)
	if (!message.id || !pending.has(message.id)) return
	const waiter = pending.get(message.id)
	pending.delete(message.id)
	if (message.error) waiter.reject(new Error(message.error.message))
	else waiter.resolve(message.result)
})

const shots = [
	['toggle', 0.72],
	['slider', 2.55],
	['notifications', 4.52],
	['keyboard', 7.26],
]

for (const [name, time] of shots) {
	console.log('shot', name)
	const target = await send('Target.createTarget', {
		url: `http://127.0.0.1:8765/?t=${time}`,
	})
	const session = await send('Target.attachToTarget', {
		targetId: target.targetId,
		flatten: true,
	})
	const sessionId = session.sessionId
	await send('Page.enable', {}, sessionId)
	await send('Emulation.setDeviceMetricsOverride', {
		width: 1920,
		height: 1080,
		deviceScaleFactor: 1,
		mobile: false,
	}, sessionId)
	await new Promise((resolve) => setTimeout(resolve, 400))
	const ready = await send('Runtime.evaluate', {
		expression: `window.seek(${time}); document.getElementById('ball').style.left`,
		returnByValue: true,
	}, sessionId)
	if (ready.exceptionDetails) {
		console.log(JSON.stringify(ready.exceptionDetails, null, 2))
		throw new Error(ready.exceptionDetails.text)
	}
	console.log('ball', ready.result && ready.result.value)
	const shot = await send('Page.captureScreenshot', {
		format: 'png',
	}, sessionId)
	fs.writeFileSync(
		path.join(stills, `${name}.png`),
		Buffer.from(shot.data, 'base64'),
	)
	await send('Target.closeTarget', { targetId: target.targetId })
	console.log(name, fs.statSync(path.join(stills, `${name}.png`)).size)
}

browser.close()
edge.kill()
server.close()
process.exit(0)
