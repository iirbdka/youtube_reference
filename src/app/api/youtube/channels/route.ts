import { NextRequest, NextResponse } from 'next/server';
import { getChannelDetails } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channelIds } = body as { channelIds: string[] };

    if (!channelIds || channelIds.length === 0) {
      return NextResponse.json(
        { error: 'Channel IDs are required' },
        { status: 400 }
      );
    }

    const channelDetails = await getChannelDetails(channelIds);

    const channels = channelDetails.map(channel => ({
      id: channel.id,
      subscriberCount: parseInt(channel.statistics.subscriberCount, 10) || 0,
      videoCount: parseInt(channel.statistics.videoCount, 10) || 0,
      viewCount: parseInt(channel.statistics.viewCount, 10) || 0,
    }));

    return NextResponse.json({ channels });
  } catch (error) {
    console.error('Channels API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch channel details' },
      { status: 500 }
    );
  }
}

