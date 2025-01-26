import { NextResponse } from 'next/server';
import { YouTubeDownloader } from '@/lib/youtube-downloader';

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();
    
    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    const downloader = new YouTubeDownloader();
    const audioPath = await downloader.downloadAudio(videoUrl);

    // Convert the full path to a relative URL for the client
    const audioUrl = `/downloads/${audioPath.split('/downloads/')[1]}`;

    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error('Error processing download:', error);
    return NextResponse.json(
      { error: 'Failed to download audio' },
      { status: 500 }
    );
  }
}
