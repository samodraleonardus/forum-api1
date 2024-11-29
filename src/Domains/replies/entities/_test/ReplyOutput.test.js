const ReplyOutput = require('../ReplyOutput');

describe('a ReplyOutput entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
    };

    expect(() => new ReplyOutput(payload)).toThrowError('REPLY_OUTPUT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    expect(() => new ReplyOutput(payload)).toThrowError('REPLY_OUTPUT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ReplyOutput object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    const { id, owner, content } = new ReplyOutput(payload);

    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
