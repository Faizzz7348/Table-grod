# Database Setup Guide

## Setup Database

Database sudah dikonfigurasi menggunakan **PostgreSQL** (Neon Database) dengan **Prisma ORM**.

### Langkah-langkah Setup:

1. **Install dependencies** (sudah dilakukan):
   ```bash
   npm install
   ```

2. **Push schema ke database**:
   ```bash
   npm run db:push
   ```
   Command ini akan membuat tables di database sesuai dengan schema yang didefinisikan di `prisma/schema.prisma`.

3. **Generate Prisma Client**:
   ```bash
   npm run db:generate
   ```
   Command ini akan generate Prisma Client yang digunakan untuk query database.

4. **Seed database dengan data awal** (opsional):
   ```bash
   npm run db:seed
   ```
   Command ini akan mengisi database dengan data sample.

5. **Buka Prisma Studio** untuk melihat data (opsional):
   ```bash
   npm run db:studio
   ```
   Prisma Studio adalah GUI untuk manage database.

## Database Schema

### Route Model
- `id`: Auto increment ID
- `route`: Nama route (contoh: "KL 7")
- `shift`: Shift kerja ("AM"/"PM")
- `warehouse`: Kode warehouse
- `locations`: Relasi one-to-many dengan Location

### Location Model
- `id`: Auto increment ID
- `no`: Nomor urut
- `code`: Kode lokasi
- `location`: Nama lokasi
- `delivery`: Frekuensi delivery (Daily/Weekly/Monthly)
- `powerMode`: Mode power
- `images`: Array URL gambar
- `routeId`: Foreign key ke Route (optional)

## Environment Variables

File `.env` di root folder berisi:
```
DATABASE_URL='postgresql://...'
```

**PENTING**: File `.env` sudah ditambahkan ke `.gitignore` untuk keamanan.

## Commands Summary

```bash
npm run db:push      # Push schema ke database
npm run db:generate  # Generate Prisma Client
npm run db:seed      # Seed database dengan data
npm run db:studio    # Buka Prisma Studio GUI
```

## Next Steps

Setelah database setup, Anda bisa:
1. Update `CustomerService.js` untuk fetch data dari database
2. Gunakan Prisma Client untuk CRUD operations
3. Buat API endpoints jika diperlukan

## Troubleshooting

Jika ada error:
- Pastikan `DATABASE_URL` di `.env` benar
- Cek koneksi internet (Neon Database memerlukan internet)
- Run `npm run db:push` ulang jika schema berubah
