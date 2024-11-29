const ReplyInput = require('../ReplyInput');

describe('a ReplyInput entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      commentId: 'comment-123',
      content: 'sebuah balasan',
    };

    expect(() => new ReplyInput(payload)).toThrowError('REPLY_INPUT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: 123,
      commentId: true,
      content: 456,
      owner: 'user-123',
    };

    expect(() => new ReplyInput(payload)).toThrowError('REPLY_INPUT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ReplyInput object correctly', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    const {
      threadId, commentId, owner, content,
    } = new ReplyInput(payload);

    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
