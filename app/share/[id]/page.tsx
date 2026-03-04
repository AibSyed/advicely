import { Container } from "@chakra-ui/react";
import { ShareCard } from "@/components/coach/share-card";

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main id="main-content">
      <Container maxW="6xl" py={{ base: 8, md: 10 }}>
        <ShareCard id={id} />
      </Container>
    </main>
  );
}
