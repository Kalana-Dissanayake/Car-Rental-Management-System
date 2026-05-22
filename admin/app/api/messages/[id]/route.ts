import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import connectDB from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import { withAuth, JWTPayload } from '@/lib/auth';

// ─── GET /api/messages/[id] (Protected) ───────────────────────────────────
async function getHandler(
  _req: NextRequest,
  _user: JWTPayload,
  context?: { params: Promise<Record<string, string>> }
) {
  try {
    const params = await context?.params;
    const id = params?.id;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 });
    }

    await connectDB();
    const message = await ContactMessage.findById(id).lean();

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Mark as read
    await ContactMessage.findByIdAndUpdate(id, { status: 'read' });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error('[GET MESSAGE ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch message' }, { status: 500 });
  }
}

// ─── DELETE /api/messages/[id] (Protected) ────────────────────────────────
async function deleteHandler(
  _req: NextRequest,
  _user: JWTPayload,
  context?: { params: Promise<Record<string, string>> }
) {
  try {
    const params = await context?.params;
    const id = params?.id;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 });
    }

    await connectDB();
    const deleted = await ContactMessage.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Booking record deleted successfully',
    });
  } catch (error) {
    console.error('[DELETE MESSAGE ERROR]', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}

export const GET = withAuth(getHandler);
export const DELETE = withAuth(deleteHandler);
