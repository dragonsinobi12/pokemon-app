# Pokédex Explorer

![Pokédex Explorer Screenshot](public/pokedex-screenshot.svg)

![Pokemon Detail Screenshot](public/pokemon-detail-screenshot.svg)

เว็บแอปพลิเคชันสำหรับค้นหาข้อมูลโปเกมอนจาก PokeAPI แบบ Responsive และสวยงาม โดยแสดงรายการโปเกมอนทั้งหมด 1,351 ตัว พร้อมหน้ารายละเอียดที่มีข้อมูลสำคัญ เช่น ชื่อ รูปภาพ ประเภท สถิติ วิวัฒนาการ และเสียงของโปเกมอน

## Features

- ดึงข้อมูลโปเกมอนทั้งหมด 1,351 ตัวจาก PokeAPI โดยโหลดข้อมูลทีละหน้าเพื่อหลีกเลี่ยงการดึงข้อมูลขนาดใหญ่ในครั้งเดียว
- แสดงรายการโปเกมอนพร้อมช่องค้นหาแบบเรียลไทม์
- หน้าแสดงรายละเอียดของโปเกมอนแต่ละตัวพร้อมข้อมูลต่อไปนี้:
  - ชื่อ
  - รูปภาพ
  - ประเภท
  - สถานะพื้นฐาน
  - วิวัฒนาการ
  - เสียงของโปเกมอน
- ใช้ Skeleton UI ในระหว่างรอโหลดข้อมูล
- มีหน้า About this project สำหรับข้อมูลผู้พัฒนาและลิงก์ Source Code
- รองรับการแสดงผลบนอุปกรณ์ต่าง ๆ ได้ดี (Responsive)

## Tech Stack

- Next.js
- React
- Material UI
- PokeAPI

## Getting Started

```bash
npm install
npm run dev
```

เปิดเบราว์เซอร์ที่ http://localhost:3000

## Project Structure

- src/app/page.tsx — หน้ารายการโปเกมอน
- src/app/pokemon/[pokemonname]/page.tsx — หน้ารายละเอียดโปเกมอน
- src/app/about/page.tsx — หน้า About this project

## Notes

ข้อมูลผู้พัฒนาในหน้า About สามารถแก้ไขได้ที่ไฟล์ src/app/about/page.tsx และลิงก์ GitHub Source Code สามารถเปลี่ยนเป็น Repository ของคุณได้
