import { db } from './db';

export interface YouTubeChannelStats {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
  channelName: string;
  customUrl: string;
  avatarUrl: string;
}

export interface YouTubeVideoItem {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
  views?: string;
  isShort?: boolean;
}

export async function fetchLiveYouTubeStats(): Promise<{
  stats: YouTubeChannelStats;
  latestVideos: YouTubeVideoItem[];
  latestShorts: YouTubeVideoItem[];
}> {
  let subCount = '385000';
  let viewCount = '142000000';
  let videoCount = '340';
  let avatarUrl = '/images/logo.svg';

  // Read current DB settings safely
  try {
    const settingsList = await db.siteSetting.findMany();
    const settingsMap = settingsList.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    if (settingsMap.subscribers_count) subCount = settingsMap.subscribers_count;
    if (settingsMap.total_views) viewCount = settingsMap.total_views;
    if (settingsMap.total_videos) videoCount = settingsMap.total_videos;
  } catch (e) {
    console.warn('DB settings read notice (using defaults):', e);
  }

  let scrapedVideos: YouTubeVideoItem[] = [];
  let scrapedShorts: YouTubeVideoItem[] = [];

  try {
    const res = await fetch('https://www.youtube.com/@DarNedYt', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 1800 },
    });

    if (res.ok) {
      const html = await res.text();
      const match = html.match(/var ytInitialData\s*=\s*({[\s\S]*?});<\/script>/) || html.match(/window\["ytInitialData"\]\s*=\s*({[\s\S]*?});/);

      if (match && match[1]) {
        const json = JSON.parse(match[1]);
        const header = json.header?.c4TabbedHeaderRenderer || json.header?.pageHeaderRenderer;
        if (header) {
          const subText = header.subscriberCountText?.simpleText || header.subscriberCountText?.runs?.[0]?.text;
          if (subText) {
            const parsedSubs = parseSubTextToNumber(subText);
            if (parsedSubs > 0) subCount = parsedSubs.toString();
          }

          const avatar = header.avatar?.thumbnails?.[0]?.url || header.content?.pageHeaderViewModel?.avatar?.avatarViewModel?.image?.sources?.[0]?.url;
          if (avatar) avatarUrl = avatar;
        }

        const foundVideos = extractVideosFromInitialData(json);
        
        if (foundVideos.length > 0) {
          scrapedVideos = foundVideos.filter(v => !v.isShort).slice(0, 2);
          scrapedShorts = foundVideos.filter(v => v.isShort).slice(0, 3);
        }
      }
    }
  } catch (err) {
    console.warn('YouTube scraping notice:', err);
  }

  // Exact DarNed Videos provided by user
  if (scrapedVideos.length === 0) {
    scrapedVideos = [
      {
        id: 'XquuW9266M8',
        title: 'DarNed Gameplay Video 1',
        thumbnail: 'https://i.ytimg.com/vi/XquuW9266M8/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=XquuW9266M8',
        publishedAt: 'DarNed Official',
      },
      {
        id: 'qfAgc_vzxlY',
        title: 'DarNed Gameplay Video 2',
        thumbnail: 'https://i.ytimg.com/vi/qfAgc_vzxlY/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=qfAgc_vzxlY',
        publishedAt: 'DarNed Official',
      },
    ];
  }

  // Exact DarNed Shorts provided by user
  if (scrapedShorts.length === 0) {
    scrapedShorts = [
      {
        id: 'XkOo3DhOv38',
        title: 'DarNed Short 1',
        thumbnail: 'https://i.ytimg.com/vi/XkOo3DhOv38/hqdefault.jpg',
        url: 'https://www.youtube.com/shorts/XkOo3DhOv38',
        publishedAt: 'DarNed Short',
        isShort: true,
      },
      {
        id: 'FeyfzeGnPzg',
        title: 'DarNed Short 2',
        thumbnail: 'https://i.ytimg.com/vi/FeyfzeGnPzg/hqdefault.jpg',
        url: 'https://www.youtube.com/shorts/FeyfzeGnPzg',
        publishedAt: 'DarNed Short',
        isShort: true,
      },
      {
        id: 'KF8oj78vXso',
        title: 'DarNed Short 3',
        thumbnail: 'https://i.ytimg.com/vi/KF8oj78vXso/hqdefault.jpg',
        url: 'https://www.youtube.com/shorts/KF8oj78vXso',
        publishedAt: 'DarNed Short',
        isShort: true,
      },
    ];
  }

  return {
    stats: {
      subscriberCount: subCount,
      viewCount: viewCount,
      videoCount: videoCount,
      channelName: 'DarNed',
      customUrl: '@DarNedYt',
      avatarUrl: avatarUrl,
    },
    latestVideos: scrapedVideos,
    latestShorts: scrapedShorts,
  };
}

function parseSubTextToNumber(text: string): number {
  const match = text.match(/([\d\.]+)\s*([KMkB]?)/);
  if (!match) return 385000;
  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === 'M') return Math.round(num * 1000000);
  if (unit === 'K') return Math.round(num * 1000);
  return Math.round(num);
}

function extractVideosFromInitialData(obj: any): YouTubeVideoItem[] {
  const results: YouTubeVideoItem[] = [];

  function traverse(item: any) {
    if (!item || typeof item !== 'object') return;

    if (item.gridVideoRenderer || item.videoRenderer) {
      const v = item.gridVideoRenderer || item.videoRenderer;
      const videoId = v.videoId;
      const title = v.title?.runs?.[0]?.text || v.title?.simpleText;
      const thumbnail = v.thumbnail?.thumbnails?.[v.thumbnail?.thumbnails?.length - 1]?.url;

      if (videoId && videoId.length > 3 && title) {
        results.push({
          id: videoId,
          title,
          thumbnail: thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          publishedAt: v.publishedTimeText?.simpleText || '',
          isShort: Boolean(v.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url?.includes('/shorts/')),
        });
      }
    }

    if (item.reelItemRenderer) {
      const r = item.reelItemRenderer;
      const videoId = r.videoId;
      const title = r.headline?.simpleText || r.headline?.runs?.[0]?.text;
      const thumbnail = r.thumbnail?.thumbnails?.[0]?.url;

      if (videoId && videoId.length > 3 && title) {
        results.push({
          id: videoId,
          title,
          thumbnail: thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          url: `https://www.youtube.com/shorts/${videoId}`,
          publishedAt: '',
          isShort: true,
        });
      }
    }

    for (const key of Object.keys(item)) {
      if (typeof item[key] === 'object') {
        traverse(item[key]);
      }
    }
  }

  traverse(obj);
  return results;
}
