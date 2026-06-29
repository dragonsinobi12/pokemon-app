"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Grid,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonListResponse {
  count: number;
  results: PokemonListItem[];
}

const formatName = (name: string) =>
  name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const PAGE_SIZE = 100;
const TOTAL_POKEMON = 1351;

export default function Home() {
  const [pokemonData, setPokemonData] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllPokemon = async () => {
      setLoading(true);
      setError(null);

      try {
        const allPokemon: PokemonListItem[] = [];

        for (let offset = 0; offset < TOTAL_POKEMON; offset += PAGE_SIZE) {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
          );

          if (!response.ok) {
            throw new Error("ไม่สามารถโหลดข้อมูลโปเกมอนได้ในขณะนี้");
          }

          const data = (await response.json()) as PokemonListResponse;
          allPokemon.push(...(data.results ?? []));
        }

        setPokemonData(allPokemon);
      } catch (err) {
        console.error("Error fetching Pokemon data:", err);
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล");
        setPokemonData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPokemon();
  }, []);

  const filteredPokemon = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return pokemonData;
    }

    return pokemonData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(normalizedQuery)
    );
  }, [pokemonData, query]);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
            Pokédex Explorer
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ค้นหาชื่อโปเกมอนจาก PokeAPI ทั้งหมด 1,351 ตัว พร้อมภาพและรายละเอียด
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button component={Link} href="/" variant="contained">
            หน้าแรก
          </Button>
          <Button component={Link} href="/about" variant="outlined">
            About this project
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          mb: 4,
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: "linear-gradient(135deg, #fdf2f8 0%, #eff6ff 100%)",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
          color: "#111827",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField
            label="ค้นหาชื่อโปเกมอน"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ flex: 1, bgcolor: "rgba(255,255,255,0.8)", borderRadius: 2 }}
          />
          <Chip
            label={`${filteredPokemon.length} ตัว`}
            color="primary"
            sx={{ px: 1, py: 1.5, fontWeight: 700 }}
          />
        </Box>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
              <Card sx={{ height: 260, borderRadius: 4 }}>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton height={28} width="70%" sx={{ mb: 1 }} />
                  <Skeleton height={20} width="50%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : filteredPokemon.length === 0 ? (
        <Typography color="text.secondary">ไม่พบโปเกมอนที่ค้นหา</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredPokemon.map((pokemon) => {
            const pokemonId = pokemon.url.split("/").filter(Boolean).pop();
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={pokemon.name}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "translateY(-4px)" },
                  }}
                >
                  <CardActionArea
                    component={Link}
                    href={`/pokemon/${pokemon.name}`}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                    }}
                  >
                    <Box
                      sx={{
                        background: "linear-gradient(135deg, #f9fafb 0%, #e0f2fe 100%)",
                        display: "flex",
                        justifyContent: "center",
                        py: 3,
                      }}
                    >
                      <Box
                        component="img"
                        src={imageUrl}
                        alt={pokemon.name}
                        sx={{ width: 120, height: 120, objectFit: "contain" }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                          {formatName(pokemon.name)}
                        </Typography>
                        <Chip label={`#${pokemonId}`} size="small" color="secondary" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        คลิกเพื่อดูรายละเอียด
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
