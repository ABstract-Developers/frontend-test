import Head from "next/head";

import { Inter, Island_Moments } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";
const inter = Inter({ subsets: ["latin"] });
import { useEffect, useState } from "react";
import {
  Container,
  Stack,
  Input,
  Button,
  SimpleGrid,
  Flex,
  Box,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import PokemonCard from "@/components/PokemonCard";
import PokemonData from "@/components/PokemonData";

export default function Home() {
  const pokemonDataModal = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const [pokemon, setPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState();
  const [currentPage, setCurrentPage] = useState(
    "https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0"
  );

  useEffect(() => {
    setIsLoading(true);
    axios.get(currentPage).then(async ({ data }) => {
      const promises = data.results.map((result) => axios(result.url));
      const fetchedPokemon = (await Promise.all(promises)).map(
        (res) => res.data
      );
      setPokemon((prev) => [...prev, ...fetchedPokemon]);
      setIsLoading(false);
    });
  }, [currentPage]);

  function handleNextPage() {}

  function handleViewPokemon(pokemon) {
    setSelectedPokemon(pokemon);
    pokemonDataModal.onOpen();
  }

  return (
    <>
      <Head>
        <title>Pokemon Challenge</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex alignItems="center" minH="100vh" justifyContent="center">
        <Container maxW="container.lg">
          <Stack p="5" alignItems="center" spacing="5">
            <SimpleGrid spacing="5" columns={{ base: 1, md: 5 }}>
              {pokemon.map((pokemon) => (
                <Box
                  as="button"
                  key={pokemon.id}
                  onClick={() => handleViewPokemon(pokemon)}
                >
                  <PokemonCard pokemon={pokemon} />
                </Box>
              ))}
            </SimpleGrid>

            <Button isLoading={false} onClick={handleNextPage}>
              Cargas más
            </Button>
          </Stack>
        </Container>
      </Flex>
      <Modal {...pokemonDataModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textTransform="capitalize">
            {selectedPokemon?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPokemon && <PokemonData pokemon={selectedPokemon} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
