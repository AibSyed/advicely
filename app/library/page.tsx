import { Container } from "@chakra-ui/react";
import { LibraryBoard } from "@/components/coach/library-board";

export default function LibraryPage() {
  return (
    <main id="main-content">
      <Container maxW="7xl" py={{ base: 8, md: 10 }}>
        <LibraryBoard />
      </Container>
    </main>
  );
}
