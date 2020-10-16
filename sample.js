const WebSocket = require('ws');
const delay = require('delay');

// const host = 'ws://127.0.0.1:3001';
const host = 'wss://8cas9pzdwa.execute-api.ap-northeast-2.amazonaws.com/development';

async function main() {
	console.log(`init	${Date.now()}`);

	// status=200 or 401
	const ws = new WebSocket(`${host}?status=200`);
	ws.onopen = () => {
		console.log(`open	${Date.now()}`);

		ws.send(`ping`);
		console.log(`ping	${Date.now()}`);
	};

	ws.onclose = () => {
		console.log(`close	${Date.now()}`);
	};

	ws.onerror = () => {
		console.log(`error	${Date.now()}`);
	};

	ws.onmessage = (ev) => {
		console.log(`message	${Date.now()}	${ev.data}`);
	}

	await delay(3000);
	ws.close();
}
main().then(x => { });
