import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import GeneratedIdea from "@/models/GeneratedIdea";

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { ideaIndex, status } = await request.json();

    if (typeof ideaIndex !== 'number') {
      return NextResponse.json({ error: "Invalid idea index" }, { status: 400 });
    }

    if (!['active', 'marked_as_video', 'saved_for_later', 'dismissed'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get the latest ideas document
    const ideasDoc = await GeneratedIdea.findOne({ userId: user._id })
      .sort({ generatedAt: -1 });

    if (!ideasDoc) {
      return NextResponse.json({ error: "No ideas found" }, { status: 404 });
    }

    if (ideaIndex < 0 || ideaIndex >= ideasDoc.ideas.length) {
      return NextResponse.json({ error: "Idea index out of range" }, { status: 400 });
    }

    // Update the specific idea's status
    console.log(`[STATUS UPDATE] Updating idea ${ideaIndex} to status: ${status}`);
    console.log(`[STATUS UPDATE] Before update:`, ideasDoc.ideas[ideaIndex].status);

    ideasDoc.ideas[ideaIndex].status = status;
    ideasDoc.ideas[ideaIndex].statusUpdatedAt = new Date();

    await ideasDoc.save();

    console.log(`[STATUS UPDATE] After update:`, ideasDoc.ideas[ideaIndex].status);
    console.log(`[STATUS UPDATE] Idea title:`, ideasDoc.ideas[ideaIndex].title);

    return NextResponse.json({
      success: true,
      idea: ideasDoc.ideas[ideaIndex],
    });
  } catch (error) {
    console.error("Error updating idea status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
