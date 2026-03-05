import { ShareExperience } from "@/components/share/share-experience";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;

  return (
    <main id="main-content">
      <ShareExperience shareId={id} />
    </main>
  );
}
