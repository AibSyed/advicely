import { ShareExperience } from "@/components/share/share-experience";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;

  return (
    <main>
      <ShareExperience shareId={id} />
    </main>
  );
}
