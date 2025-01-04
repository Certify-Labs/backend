import { YoutubeTranscript } from "youtube-transcript";

interface TranscriptItem {
  text: string;
  offset: number;
  duration: number;
}

class YouTubeScraper {
  private extractVideoId(url: string): string {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube.com\/watch\?.*v=([^&\n?#]+)/,
      /youtube.com\/shorts\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    throw new Error("Invalid YouTube URL format");
  }

  async getTranscript(videoUrl: string): Promise<TranscriptItem[]> {
    try {
      const videoId = this.extractVideoId(videoUrl);
      return await YoutubeTranscript.fetchTranscript(videoId);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Could not find transcript data")
      ) {
        throw new Error("No transcripts available for this video");
      }
      throw error;
    }
  }

  async getPlainTranscript(videoUrl: string): Promise<string> {
    const transcript = await this.getTranscript(videoUrl);
    return transcript.map((item) => item.text).join(" ");
  }

  async getFormattedTranscript(videoUrl: string): Promise<string> {
    const transcript = await this.getTranscript(videoUrl);
    return transcript
      .map((item) => {
        const time = new Date(item.offset).toISOString().substr(11, 8);
        return `[${time}] ${item.text}`;
      })
      .join("\n");
  }
}

export type { TranscriptItem };
export { YouTubeScraper };
