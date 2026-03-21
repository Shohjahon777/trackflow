import type { ProjectStatus, ProjectCategory, NoteType } from "@prisma/client";

export type { ProjectStatus, ProjectCategory, NoteType };

export type ProjectWithNotes = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  repoUrl: string | null;
  deployUrl: string | null;
  stack: string[];
  category: ProjectCategory;
  shareToken: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  notes: {
    id: string;
    title: string;
    type: NoteType;
  }[];
};
