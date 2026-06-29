"use client";
import Link from "next/link";
import { Box, Button, Card, CardContent, Container, Grid, Typography } from "@mui/material";

const developerInfo = [
  { label: "ผู้พัฒนา", value: "นายรณกฤต สาแก้ว" },
  { label: "ชั้นปี", value: "ชั้นปีที่ 4" },
  { label: "รายวิชา", value: "IN403101 Front-end Web Programming" },
  { label: "คณะ/สาขา", value: "คณะสหวิทยาการ สาขาวิทยาการคอมพิวเตอร์ และสารสนเทศ" },
  { label: "มหาวิทยาลัย", value: "มหาวิทยาลัยขอนแก่น วิทยาเขตหนองคาย" },
];

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Button component={Link} href="/" variant="outlined" sx={{ mb: 3, borderRadius: 999 }}>
        ← กลับไปหน้าแรก
      </Button>

      <Box
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: "linear-gradient(135deg, #fef3c7 0%, #eff6ff 100%)",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
          About this project
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          เว็บแอปนี้สร้างขึ้นเพื่อศึกษาการเชื่อมต่อกับ PokeAPI และแสดงข้อมูลโปเกมอนแบบ Responsive พร้อมเนื้อหาและอินเตอร์แอ็กชันที่สวยงาม
        </Typography>

        <Grid container spacing={2}>
          {developerInfo.map((item) => (
            <Grid size={{ xs: 12, sm: 6 }} key={item.label}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Button
            component="a"
            href="https://github.com/dragonsinobi12/pokemon-app"
            target="_blank"
            rel="noreferrer"
            variant="contained"
          >
            ดู Source Code บน GitHub
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
