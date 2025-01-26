import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',
};

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { videoId, currentMood } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
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
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    return NextResponse.json({ suggestions: data.choices[0].message.content });
  } catch (error: unknown) {
    console.error('Error processing mood:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process audio parameters';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
