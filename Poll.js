// eslint-disable-next-line
class Script {
  constructor() {
    this.answers = [];
    this.question = '';
    this.results = {};

    this.emojis = [
      ':zero:',
      ':one:',
      ':two:',
      ':three:',
      ':four:',
      ':five:',
      ':six:',
      ':seven:',
      ':eight:',
      ':nine:',
      ':ten:',
    ];
  }

  currentPoll() {
    if (this.answers.length !== 0) {
      let text = `**${this.question}**\n`;
      this.answers.forEach((answer, i) => {
        text += `${this.emojis[i]} ${answer}\n`;
      });
      return text;
    }
    return 'No current poll';
  }
  // eslint-disable-next-line
  prepare_outgoing_request({ request }) {
    let match = request.data.text.match(/^poll results$/);
    if (match) {
      if (this.answers.length !== 0) {
        const results = {};
        Object.keys(this.results).forEach((mofo) => {
          if (typeof results[this.results[mofo]] === 'undefined') {
            results[this.results[mofo]] = 0;
          }
          results[this.results[mofo]] += 1;
        });

        const resultsSorted = Object.keys(results).sort((a, b) => results[b] - results[a]);

        let text = `**${this.question}**\n`;
        resultsSorted.forEach((result) => {
          text += `${this.emojis[result]} ${this.answers[result]} \`${results[result]}/${Object.keys(this.results).length}\`\n`;
        });

        return {
          message: {
            text,
          },
        };
      }
      return {
        message: {
          text: this.currentPoll(),
        },
      };
    }

    match = request.data.text.match(/^poll$/);
    if (match) {
      return {
        message: {
          text: this.currentPoll(),
        },
      };
    }

    match = request.data.text.match(/^poll vote (:[a-z]+:)/);
    if (match) {
      if (this.answers.length !== 0) {
        const vote = this.emojis.indexOf(match[1]);
        if (vote >= 0 && vote < this.answers.length) {
          this.results[request.data.user_name] = vote;
          return {
            message: {
              text: 'Thx bro !',
            },
          };
        }

        return {
          message: {
            text: `Mauvais vote !\n${this.currentPoll()}`,
          },
        };
      }

      return {
        message: {
          text: this.currentPoll(),
        },
      };
    }

    match = request.data.text.match(/((["'])(?:(?=(\\?))\3.)*?\2)/g);
    if (match && match.length > 1) {
      this.question = match.shift();
      this.answers = match;
      this.results = {};

      return {
        message: {
          text: this.currentPoll(),
        },
      };
    }

    return {
      message: {
        text: [
          '**commands**',
          '```',
          'poll "Question ?" "choice 1" "choice 2" "..." // Define poll',
          'poll results // See results',
          'poll vote :numberEmoji: // Vote',
          'poll // See poll',
          '```',
        ].join('\n'),
      },
    };
  }
}
