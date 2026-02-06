import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import User from "@/models/User"
import { fetchWeeklyIdeas } from "@/lib/email/fetch-weekly-ideas"
import { sendWeeklyEmail } from "@/lib/email/sender"
import connectDB from "@/lib/db/mongodb"

export async function POST() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({}, { status: 401 })
  }

  await connectDB()

  const user = await User.findOne({ email: session.user.email })
  if (!user) {
    return NextResponse.json({}, { status: 404 })
  }

  const result = await fetchWeeklyIdeas(
    user._id.toString(),
    user.settings.ideaCount
  )
  if (!result) {
    return NextResponse.json({ error: "No ideas found" }, { status: 400 })
  }

  await sendWeeklyEmail({
    user,
    ideasDoc: result.doc,
    ideas: result.ideas,
  })

  return NextResponse.json({ success: true })
}
