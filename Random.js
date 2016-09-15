// eslint-disable-next-line
class Script {
  constructor() {
    this.counter = 0;
    this.rand = [];
  }

  // eslint-disable-next-line
  prepare_outgoing_request({ request }) {
    const apiKey = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
    const match = request.data.text.match(/((["'])(?:(?=(\\?))\3.)*?\2)/g);
    if (match && match.length > 1) {
      this.rand = match;
      this.counter += 1;
      const data = {
        jsonrpc: '2.0',
        method: 'generateSignedIntegers',
        params: {
          apiKey,
          n: 1,
          min: 0,
          max: this.rand.length - 1,
        },
        id: this.counter,
      };
      return {
        url: request.url,
        headers: request.headers,
        method: 'POST',
        data,
      };
    }

    return {
      message: {
        text: [
          '**command**',
          '```',
          'random "choiceX" "choiceY"...',
          '```',
        ].join('\n'),
      },
    };
  }

  // eslint-disable-next-line
  process_outgoing_response({ request, response }) {
    const curl = "curl https://api.random.org/json-rpc/1/invoke -H 'Content-Type: application/json' --data ";
    const verify = {
      jsonrpc: '2.0',
      method: 'verifySignature',
      params: {
        random: response.content.result.random,
        signature: response.content.result.signature,
      },
      id: this.counter,
    };

    return {
      content: {
        text: [
          `**Winner : ${this.rand[response.content.result.random.data[0]]}**`,
          'To check : ',
          '```',
          `${curl}'${JSON.stringify(verify)}'`,
          '```',
        ].join('\n'),
        parseUrls: false,
      },
    };
  }
}
