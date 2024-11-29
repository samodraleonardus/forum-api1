const CommentOutput = require('../CommentOutput');

describe('a CommentOutput entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
    };

    expect(() => new CommentOutput(payload)).toThrowError('COMMENT_OUTPUT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      content: 123,
      owner: 'user-123',
    };

    expect(() => new CommentOutput(payload)).toThrowError('COMMENT_OUTPUT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CommentOutput object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    };

    const { id, owner, content } = new CommentOutput(payload);

    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
