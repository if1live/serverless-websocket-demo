import { APIGatewayProxyHandler } from "aws-lambda";
import { ApiGatewayManagementApi } from "aws-sdk";
import delay from 'delay';

if (process.env.NODE_ENV === "development") {
	require("source-map-support/register");
}

export const connect: APIGatewayProxyHandler = async event => {
	const connectionId = event.requestContext.connectionId;
	const status = parseInt(event.queryStringParameters.status ?? '200', 10);

	console.log(`connect_start	${Date.now()}	${connectionId}`);
	await delay(1000);
	console.log(`connect_finish	${Date.now()}	${connectionId}	${status}`);
	return {
		statusCode: status,
		body: "OK"
	};
};

export const disconnect: APIGatewayProxyHandler = async event => {
	const connectionId = event.requestContext.connectionId;
	console.log(`disconnect_start	${Date.now()}	${connectionId}`);
	await delay(1000);
	console.log(`disconnect_finish	${Date.now()}	${connectionId}`);
	return {
		statusCode: 200,
		body: "OK"
	};
};

export const handle: APIGatewayProxyHandler = async event => {
	const connectionId = event.requestContext.connectionId!;
	console.log(`ping_start	${Date.now()}	${connectionId}`);

	// console.log(JSON.stringify(event, null, 2));

	// lambda: f3w1jmmhb3.execute-api.ap-northeast-2.amazonaws.com/dev
	// offline: private.execute-api.ap-northeast-2.amazonaws.com/local
	const region = process.env.AWS_REGION;
	const apiId = event.requestContext.apiId;
	const stage = event.requestContext.stage;
	let endpoint = '';
	if (apiId === 'private') {
		const port = (event.headers ?? {})['X-Forwarded-Port'] ?? 3001;
		if (port) {
			endpoint = `http://${event.requestContext.identity.sourceIp}:${port}`;
		} else {
			endpoint = `http://${event.requestContext.identity.sourceIp}`;
		}
	} else {
		endpoint = `${apiId}.execute-api.${region}.amazonaws.com/${stage}`;
	}

	const api = new ApiGatewayManagementApi({ endpoint });
	await api.postToConnection({ ConnectionId: connectionId, Data: `pong	${connectionId}` }).promise();

	console.log(`ping_finish	${Date.now()}	${connectionId}`);
	return {
		statusCode: 200,
		body: "OK",
	}
};
