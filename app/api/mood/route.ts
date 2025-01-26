import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
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
  } catch (error) {
    console.error('Error processing mood:', error);
    return NextResponse.json(
      { error: 'Failed to process audio parameters' },
      { status: 500 }
    );
  }
}
