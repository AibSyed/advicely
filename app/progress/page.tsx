import { Container } from "@chakra-ui/react";
import { ProgressBoard } from "@/components/coach/progress-board";

export default function ProgressPage() {
  return (
    <main id="main-content">
      <Container maxW="7xl" py={{ base: 8, md: 10 }}>
        <ProgressBoard />
      </Container>
    </main>
  );
}
