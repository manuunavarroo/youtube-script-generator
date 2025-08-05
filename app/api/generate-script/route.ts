// Filename: app/api/generate-script/route.ts
import { NextResponse } from 'next/server';

// The URL for your n8n webhook
const WEBHOOK_URL = 'https://manuel-fanvue.app.n8n.cloud/webhook-test/generate-script';

export async function POST(request: Request) {
  try {
    // 1. Parse the request body from our frontend
    const body = await request.json();
    const { videoUrl, topic } = body;

    // 2. Basic validation
    if (!videoUrl || !topic) {
      return NextResponse.json(
        { error: 'Missing videoUrl or topic in request body' },
        { status: 400 }
      );
    }

    // 3. Forward the data to the n8n webhook
    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoUrl: videoUrl, // Ensure the keys match what n8n expects
        topic: topic,
      }),
    });

    // 4. Check if the webhook call was successful
    if (!webhookResponse.ok) {
      // If the webhook returns an error, forward that error to our frontend
      const errorText = await webhookResponse.text();
      console.error('Webhook error:', errorText);
      return NextResponse.json(
        { error: `Webhook failed: ${webhookResponse.statusText}` },
        { status: webhookResponse.status }
      );
    }
    
    // 5. Send a success response back to our frontend
    return NextResponse.json(
        { message: 'Request successfully forwarded to webhook.' },
        { status: 200 }
    );

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
