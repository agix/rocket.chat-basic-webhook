// eslint-disable-next-line
class Script {
  // eslint-disable-next-line
  prepare_outgoing_request({ request }) {
    const cx = '012345678901234567891:-aaaaaaaaaa';
    const key = 'qJB8F7JNqgU1JZ+DfFWGFTnZc8EHsKGoFNTqMVgU';

    let query = 'safe=off&';
    query += 'fields=items(link)&';
    query += `cx=${cx}&`;
    query += `key=${key}&`;
    query += 'searchType=image&';
    let match;
    match = request.data.text.match(/^animate (.+)/);
    if (match) {
      query += 'fileType=gif&';
      query += 'hq=animated&';
      query += 'tbs=itp:animated&';
    } else {
      match = request.data.text.match(/^image (.+)/);
    }

    if (match) {
      query += `q=${match[1]}`;

      return {
        url: `${request.url}?${query}`,
        headers: request.headers,
        method: 'GET',
      };
    }

    return {
      message: {
        text: [
          '**commands**',
          '```',
          'image whatever',
          'animate whatever',
          '```',
        ].join('\n'),
      },
    };
  }

  // eslint-disable-next-line
  process_outgoing_response({ request, response }) {
    if (response.status_code === 200) {
      if (response.content.items.length === 0) {
        return {
          message: {
            text: [
              '**Not Found**',
            ].join('\n'),
          },
        };
      }
      const id = Math.floor((Math.random() * response.content.items.length) + 0);
      return {
        content: {
          text: '',
          parseUrls: false,
          attachments: [{
            image_url: response.content.items[id].link,
          }],
        },
      };
    }
    return {
      message: {
        text: [
          '**Error**',
        ].join('\n'),
      },
    };
  }
}
