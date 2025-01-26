import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { mkdir } from 'fs/promises';

// Configure ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export class YouTubeDownloader {
  private outputDir: string;

  constructor() {
    // Set output directory to public/downloads
    this.outputDir = join(process.cwd(), 'public', 'downloads');
  }

  /**
   * Downloads audio from a YouTube video and converts it to MP3
   * @param videoUrl YouTube video URL
   * @returns Promise with the path to the downloaded MP3 file
   */
  async downloadAudio(videoUrl: string): Promise<string> {
    try {
      // Validate YouTube URL
      if (!ytdl.validateURL(videoUrl)) {
        throw new Error('Invalid YouTube URL');
      }

      // Get video info
      const videoInfo = await ytdl.getInfo(videoUrl);
      const videoId = videoInfo.videoDetails.videoId;
      const title = videoInfo.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');

      // Create output directory if it doesn't exist
      await mkdir(this.outputDir, { recursive: true });

      // Set up file paths
      const tempPath = join(this.outputDir, `${videoId}_temp.mp4`);
      const outputPath = join(this.outputDir, `${title}_${videoId}.mp3`);

      // Download audio stream
      return new Promise((resolve, reject) => {
        const audioStream = ytdl(videoUrl, {
          quality: 'highestaudio',
          filter: 'audioonly',
        });

        // Convert to MP3 using ffmpeg
        ffmpeg(audioStream)
          .toFormat('mp3')
          .audioBitrate(192)
          .on('error', (err) => {
            console.error('Error converting to MP3:', err);
            reject(err);
          })
          .on('end', () => {
            console.log('Audio download and conversion completed');
            resolve(outputPath);
          })
          .save(outputPath);
      });
    } catch (error) {
      console.error('Error downloading audio:', error);
      throw error;
    }
  }

  /**
   * Gets the local file path for a video ID if it exists
   * @param videoId YouTube video ID
   * @returns Path to the MP3 file if it exists, null otherwise
   */
  async getExistingAudioFile(videoId: string): Promise<string | null> {
    try {
      const files = await readdir(this.outputDir);
      const audioFile = files.find(file => file.includes(videoId) && file.endsWith('.mp3'));
      return audioFile ? join(this.outputDir, audioFile) : null;
    } catch {
      return null;
    }
  }

  /**
   * Cleans up temporary files
   * @param filePath Path to the file to delete
   */
  async cleanup(filePath: string): Promise<void> {
    try {
      await unlink(filePath);
    } catch (error) {
      console.error('Error cleaning up file:', error);
    }
  }
}
