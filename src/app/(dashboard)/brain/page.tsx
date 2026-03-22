import { getNotes, getUserProjects } from "@/actions/note";
import { CreateNoteDialog } from "@/components/project/brain/create-note-dialog";
import { BrainView } from "@/components/project/brain/brain-view";

export default async function BrainPage() {
  const [notes, projects] = await Promise.all([getNotes(), getUserProjects()]);

  return (
    <div className="mx-auto max-w-[1280px] space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-medium leading-[1.25] text-text-primary">
            Brain
          </h1>
          <p className="mt-1 text-[14px] text-text-secondary">
            Your project context store — prompts, decisions, and notes.
          </p>
        </div>
        <CreateNoteDialog projects={projects} />
      </div>

      <BrainView notes={notes} />
    </div>
  );
}
