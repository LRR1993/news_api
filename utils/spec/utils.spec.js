const { expect } = require('chai');
const { timestampFormat } = require('../utils');

describe('#timestampFormat', () => {
  it('doesnt mutate the original information', () => {
    const input = [];
    expect(timestampFormat(input)).to.not.equal(input);
  });
  it('changes javascript timestamp into an sql time stamp', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const output = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2018-11-15T12:21:54.171Z',
        votes: 100
      }
    ];
    expect(timestampFormat(input)).to.eql(output);
  });
  it('changes javascript timestamp array into an sql time stamp', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      },
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171
      }
    ];
    const output = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2018-11-15T12:21:54.171Z',
        votes: 100
      },
      {
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: '2010-11-17T12:21:54.171Z'
      }
    ];
    expect(timestampFormat(input)).to.eql(output);
  });
});
