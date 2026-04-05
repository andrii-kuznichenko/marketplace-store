import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function moderateText(text: string): Promise<boolean> {
  const moderation = await openai.moderations.create({
    model: 'omni-moderation-latest',
    input: text,
  });

  return moderation.results[0].flagged;
}