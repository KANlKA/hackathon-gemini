export interface YouTubeChannel {
  id: string;
  title: string;
  subscriberCount: number;
  thumbnailUrl: string;
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  duration: string;
  views: number;
  likes: number;
  commentCount: number;
}

export interface YouTubeComment {
  commentId: string;
  authorName: string;
  text: string;
  likes: number;
  publishedAt: string;
}