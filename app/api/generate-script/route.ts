// Filename: app/api/generate-script/route.ts
import { NextResponse } from 'next/server';

// The URL for your n8n webhook
const WEBHOOK_URL = 'https://fanvue1.app.n8n.cloud/webhook/generate-script';

export async function POST(request: Request) {
  try {
    // 1. Parse the request body from our frontend
    const body = await request.json();
    const { videoUrl, topic, email } = body; // <-- Destructure email

    // 2. Basic validation
    if (!videoUrl || !topic || !email) { // <-- Add email to validation
      return NextResponse.json(
        { error: 'Missing videoUrl, topic, or email in request body' },
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
        videoUrl: videoUrl,
        topic: topic,
        email: email, // <-- Add email to the webhook body
      }),
    });

    // 4. Check if the webhook call was successful
    if (!webhookResponse.ok) {
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

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('API Route Error:', error.message);
    } else {
      console.error('API Route Error:', error);
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
