import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { videoId, currentMood } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a music mood expert that provides specific audio processing parameters."
        },
        {
          role: "user",
          content: `Analyze the mood transformation request for video ID ${videoId}. 
            The target mood value is ${currentMood} (0-100, where 0 is very chill and 100 is very energetic).
            Provide audio processing parameters including:
            - BPM adjustment
            - EQ settings (bass, mid, treble)
            - Suggested effects
            Format the response as JSON.`
        }
      ]
    });

    const suggestions = completion.choices[0].message.content;
    return NextResponse.json({ suggestions });
  } catch (error: unknown) {
    console.error('Error processing mood:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process audio parameters';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
