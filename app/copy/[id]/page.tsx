import { CopyExperience } from "@/components/copy/copy-experience";

interface CopyPageProps {
  params: Promise<{ id: string }>;
}

export default async function CopyPage({ params }: CopyPageProps) {
  const { id } = await params;

  return (
    <main id="main-content">
      <CopyExperience copyId={id} />
    </main>
  );
}
