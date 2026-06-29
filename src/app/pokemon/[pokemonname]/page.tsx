"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default: string | null;
      };
      home?: {
        front_default: string | null;
      };
      dream_world?: {
        front_default: string | null;
      };
    };
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  cries?: {
    latest: string | null;
    legacy: string | null;
  };
  species: {
    name: string;
    url: string;
  };
  forms: {
    name: string;
    url: string;
  }[];
}

interface PokemonSpeciesResponse {
  name: string;
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
  evolution_chain?: { url: string };
  varieties?: {
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }[];
}

interface EvolutionChainLink {
  species: { name: string; url: string };
  evolves_to: EvolutionChainLink[];
}

interface EvolutionChainResponse {
  chain: EvolutionChainLink;
}

const typeColors: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const formatName = (name: string) =>
  name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const buildCandidateNames = (input: string) => {
  const trimmed = decodeURIComponent(input).trim().toLowerCase();
  const candidates = new Set<string>();

  if (trimmed) {
    candidates.add(trimmed);
    candidates.add(trimmed.replace(/\s+/g, "-"));
    candidates.add(trimmed.replace(/_/g, "-"));
  }

  return Array.from(candidates);
};

export default function PokemonDetailPage({
  params,
}: {
  params: Promise<{ pokemonname: string }>;
}) {
  const { pokemonname } = use(params);
  const [pokemon, setPokemon] = useState<PokemonDetailResponse | null>(null);
  const [species, setSpecies] = useState<PokemonSpeciesResponse | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPokemon = async () => {
      setLoading(true);
      setError(null);

      try {
        const candidates = buildCandidateNames(pokemonname);
        let pokemonData: PokemonDetailResponse | null = null;
        let speciesData: PokemonSpeciesResponse | null = null;

        for (const candidate of candidates) {
          const pokemonResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(candidate)}`
          );

          if (!pokemonResponse.ok) {
            continue;
          }

          const fetchedPokemon = (await pokemonResponse.json()) as PokemonDetailResponse;
          const speciesUrl = fetchedPokemon.species?.url;

          if (!speciesUrl) {
            continue;
          }

          const speciesResponse = await fetch(speciesUrl);

          if (!speciesResponse.ok) {
            continue;
          }

          pokemonData = fetchedPokemon;
          speciesData = (await speciesResponse.json()) as PokemonSpeciesResponse;
          break;
        }

        if (!pokemonData || !speciesData) {
          throw new Error("ไม่พบข้อมูลโปเกมอนนี้");
        }

        setPokemon(pokemonData);
        setSpecies(speciesData);

        if (speciesData.evolution_chain?.url) {
          const evolutionResponse = await fetch(speciesData.evolution_chain.url);
          if (evolutionResponse.ok) {
            const evolutionData = (await evolutionResponse.json()) as EvolutionChainResponse;
            const chain: string[] = [];
            let current = evolutionData.chain;

            while (current) {
              chain.push(current.species.name);
              current = current.evolves_to[0];
            }

            setEvolutionChain(chain);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, [pokemonname]);

  const description =
    species?.flavor_text_entries.find((entry) => entry.language.name === "en")
      ?.flavor_text.replace(/\f/g, " ") ??
    "ไม่มีข้อมูลคำอธิบายในตอนนี้";

  const imageUrl =
    pokemon?.sprites.other?.["official-artwork"]?.front_default ||
    pokemon?.sprites.other?.home?.front_default ||
    pokemon?.sprites.other?.dream_world?.front_default ||
    pokemon?.sprites.front_default ||
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";

  const cryUrl = pokemon?.cries?.latest || pokemon?.cries?.legacy || null;
  const formName =
    pokemon?.forms?.[0]?.name && pokemon.forms[0].name !== pokemon.name
      ? formatName(pokemon.forms[0].name)
      : null;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Button component={Link} href="/" variant="outlined" sx={{ mb: 3, borderRadius: 999 }}>
        ← กลับไปหน้ารวม
      </Button>

      {loading ? (
        <Stack spacing={3}>
          <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
            <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 3, mb: 2 }} />
            <Skeleton height={40} width="60%" />
            <Skeleton height={24} width="90%" sx={{ mt: 1 }} />
            <Skeleton height={24} width="40%" sx={{ mt: 1 }} />
          </Paper>
          <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
            <Skeleton height={32} width="40%" />
            <Skeleton height={20} width="100%" sx={{ mt: 2 }} />
            <Skeleton height={20} width="90%" sx={{ mt: 1 }} />
          </Paper>
        </Stack>
      ) : error || !pokemon ? (
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {error ?? "ไม่พบข้อมูลโปเกมอน"}
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={3}>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              background: "linear-gradient(135deg, #fdf2f8 0%, #eff6ff 100%)",
              boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
            }}
          >
            <Grid container spacing={4} sx={{ alignItems: "center" }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box
                    component="img"
                    src={imageUrl}
                    alt={pokemon.name}
                    sx={{ width: 240, height: 240, objectFit: "contain" }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={2}>
                  <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
                    #{pokemon.id.toString().padStart(3, "0")}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, textTransform: "capitalize" }}>
                    {formatName(pokemon.name)}
                  </Typography>
                  {formName ? (
                    <Chip label={`ฟอร์ม: ${formName}`} variant="outlined" sx={{ width: "fit-content" }} />
                  ) : null}
                  <Typography color="text.secondary">{description}</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {pokemon.types.map(({ type }) => (
                      <Chip
                        key={type.name}
                        label={type.name}
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: 700,
                          backgroundColor: typeColors[type.name] ?? "#e5e7eb",
                          color: "#111827",
                        }}
                      />
                    ))}
                  </Box>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>ความสูง</Typography>
                      <Typography>{(pokemon.height / 10).toFixed(1)} m</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>น้ำหนัก</Typography>
                      <Typography>{(pokemon.weight / 10).toFixed(1)} kg</Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {pokemon.abilities.map(({ ability }) => (
                      <Chip key={ability.name} label={ability.name} variant="outlined" />
                    ))}
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  สถิติพื้นฐาน
                </Typography>
                <Stack spacing={2}>
                  {pokemon.stats.map((stat) => (
                    <Box key={stat.stat.name}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography sx={{ textTransform: "capitalize" }}>
                          {stat.stat.name}
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>{stat.base_stat}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(Math.max(stat.base_stat, 0), 255)}
                        sx={{ height: 10, borderRadius: 999 }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  วิวัฒนาการ
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {evolutionChain.length > 0 ? (
                    evolutionChain.map((stage, index) => (
                      <Chip
                        key={`${stage}-${index}`}
                        label={formatName(stage)}
                        color={index === evolutionChain.length - 1 ? "primary" : "default"}
                      />
                    ))
                  ) : (
                    <Typography color="text.secondary">ไม่มีข้อมูลวิวัฒนาการ</Typography>
                  )}
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    เสียงของโปเกมอน
                  </Typography>
                  {cryUrl ? (
                    <audio controls preload="none" src={cryUrl}>
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <Typography color="text.secondary">
                      ไม่มีไฟล์เสียงสำหรับโปเกมอนตัวนี้ในขณะนี้
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      )}
    </Container>
  );
}
