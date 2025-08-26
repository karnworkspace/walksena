# การติดตั้งใน Replit

## ขั้นตอนการ Deploy

### 1. Import Project
- Fork หรือ Clone โปรเจคนี้ใน Replit
- Replit จะอ่านไฟล์ `.replit` และ `replit.nix` อัตโนมัติ

### 2. ตั้งค่า Secrets (สำคัญมาก!)
ไปที่ Secrets tab ใน Replit และเพิ่ม:

```
SPREADSHEET_ID=1abc123def456... (ID ของ Google Sheets)
```

### 3. อัปโหลด Service Account Key
- Copy ไฟล์ `service-account-key.json` ไปวางที่ `server/service-account-key.json`
- หรือตั้งเป็น Secret ชื่อ `GOOGLE_SERVICE_ACCOUNT_KEY` (JSON string)

### 4. รัน Project
กด Run button หรือใช้คำสั่ง:
```bash
npm run install-all && npm run build && npm start
```

## โครงสร้างโปรเจค
```
/
├── server/           # Express.js API server
│   ├── src/         # TypeScript source
│   └── dist/        # Compiled JavaScript
├── walk-in-form/    # React frontend
└── .replit          # Replit configuration
```

## Port
- Server จะรันที่ port 3001
- Replit จะ proxy ไปที่ port 80 อัตโนมัติ

## การแก้ปัญหา
1. ถ้า build ล้มเหลว: ตรวจสอบ dependencies
2. ถ้า Google Sheets error: ตรวจสอบ SPREADSHEET_ID และ service account key
3. ถ้า frontend ไม่แสดง: ตรวจสอบว่า build สำเร็จแล้ว