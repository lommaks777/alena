const { OpenAI } = require('openai');

describe('OpenAI connectivity', () => {
  it('responds to a minimal ping', async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set for the test environment');
    }
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: 'ping'
    });
    expect(typeof response).toBe('object');
    expect(response.output_text).toBeDefined();
  });
});
