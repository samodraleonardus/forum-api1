const CommentInput = require('../CommentInput');

describe('a CommentInput entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'sebuah comment',
    };

    expect(() => new CommentInput(payload)).toThrowError('COMMENT_INPUT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 123,
      threadId: 123,
      owner: 'user-123',
    };

    expect(() => new CommentInput(payload)).toThrowError('COMMENT_INPUT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CommentInput object correctly', () => {
    const payload = {
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const { threadId, owner, content } = new CommentInput(payload);

    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
