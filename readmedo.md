# คู่มือ Deploy และตั้งค่าระบบ Walk‑in (ไทย)

เอกสารนี้สรุปขั้นตอนที่เราได้ทำไว้ให้ครบทั้งฝั่ง Backend (Render) และ Frontend (Vercel) รวมถึงวิธีเปลี่ยน Google Sheet ให้ระบบใช้งานได้ทันที โดยไม่ต้องอ่านโค้ดทั้งหมดใหม่

## โครงสร้างโปรเจกต์
- Backend: โฟลเดอร์ `server/` (Node.js + Express + TypeScript)
- Frontend: โฟลเดอร์ `walk-in-form/` (React Create React App)
- จุดเรียก API ฝั่งเว็บ ใช้ตัวแปรแวดล้อม `REACT_APP_API_URL` (ตั้งใน Vercel)

## ตัวแปรแวดล้อมสำคัญ (Backend)
ใส่บน Render (หรือ .env เวลา dev)
- `GOOGLE_SERVICE_ACCOUNT`: เนื้อไฟล์ JSON ของ Service Account ทั้งก้อน (รวม `{` ถึง `}`)
- `SPREADSHEET_ID`: ไอดีชีต (ดึงจาก URL ของ Google Sheet)
- (ถ้าต้องการ) `SHEET_NAME`: ชื่อแท็บในชีต (ค่าเริ่มต้นในโค้ดคือ `Walk-In`)
- `PORT`: ไม่ต้องตั้งบน Render (ระบบกำหนดให้เอง)
- `SERVE_FRONTEND`: ตั้งค่าเป็น `true` เฉพาะกรณีให้ Backend เสิร์ฟไฟล์ React ที่ build แล้ว (ปกติไม่ต้องใช้ เพราะเราดีพลอยเว็บที่ Vercel)

หมายเหตุ Service Account
- ต้องแชร์ชีทให้ `client_email` ของ Service Account เป็น Editor มิฉะนั้นอ่าน/เขียนไม่ได้
- โค้ดจะแปลง `\\n` ใน `private_key` ให้เป็นบรรทัดใหม่ให้อัตโนมัติ วางค่า JSON ได้ทั้งแบบหลายบรรทัดและแบบหนึ่งบรรทัด

## ตัวแปรแวดล้อมสำคัญ (Frontend)
ใส่บน Vercel (Project > Settings > Environment Variables)
- `REACT_APP_API_URL` = URL ของ Backend บน Render เช่น `https://walksena.onrender.com`

## ขั้นตอนดีพลอย Backend (Render)
1) เชื่อม GitHub กับ Render และอนุญาตแอป Render ให้เข้าถึง repo `walksena`
2) New > Web Service
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3) ใส่ Environment Variables: `GOOGLE_SERVICE_ACCOUNT`, `SPREADSHEET_ID` (และ `SHEET_NAME` หากใช้)
4) Deploy และทดสอบ `GET /api/health` เช่น `https://walksena.onrender.com/api/health` จะได้ `{ "status":"OK" }`

หมายเหตุ
- ถ้าเห็น Error `ENOENT: ... /walk-in-form/build/index.html` บน Render คือฝั่ง Backend พยายามเสิร์ฟ React แต่ไม่มีไฟล์ build ให้ปิดด้วยการไม่ตั้ง `SERVE_FRONTEND` หรือปล่อยค่าที่ไม่ใช่ `true`

## ขั้นตอนดีพลอย Frontend (Vercel)
1) Add New Project > เลือก repo นี้
2) Root Directory: `walk-in-form`
3) Build & Output
   - Build Command: `npm install && npm run build`
   - Output Directory: `build`
4) ตั้ง `REACT_APP_API_URL` เป็น URL ของ Backend (Render)
5) Deploy → เปิดโดเมนของ Vercel เพื่อทดสอบโหลดข้อมูล/บันทึกข้อมูลได้

## การรันในเครื่อง (Local)
Backend
- `cd server && npm install && npm run dev` (รันที่ `http://localhost:3001`)
- ตั้งค่าตัวแปรในไฟล์ `.env` หรือ export ใน shell

Frontend
- `cd walk-in-form && npm install && npm start` (รันที่ `http://localhost:3000`)
- ตั้ง `REACT_APP_API_URL=http://localhost:3001` ใน `.env` ฝั่งเว็บ (ถ้าต้องการ)

## การเปลี่ยน Google Sheet (ย้ายชีต/เปลี่ยนแท็บ)
เมื่อมีการเปลี่ยนชีตหรือแท็บ ให้ทำ 3 อย่างนี้
1) แชร์ชีตใหม่ให้ Service Account (ดู `client_email` ใน JSON) เป็น Editor
2) อัปเดต Env ของ Backend บน Render
   - `SPREADSHEET_ID` ให้เป็น id ของชีตใหม่
   - (ถ้าแท็บชื่อใหม่) เพิ่ม/อัปเดต `SHEET_NAME` ให้ตรงกับแท็บจริง
3) กด Redeploy ที่ Render

## แม็ประบบกับคอลัมน์ในชีต (สำคัญ)
- Running Number: ระบบเขียนหมายเลขที่คอลัมน์ A และ F และคำนวณเลขถัดไปจาก `max(A,F)+1`
- วันที่เข้าชม (Column I): ระบบอ่าน/เขียนเป็นรูปแบบวัน/เดือน/ปี (ปีสากล ค.ศ.) และแปลง พ.ศ. → ค.ศ. อัตโนมัติ
- AI Summary (ดูใน Modal และปุ่ม AI ใน List)
  - `AI1` = สถานะ
  - `AI2` = วัตถุประสงค์
  - `AI3` = สาเหตุ
  - `AI4` = รายละเอียด
- การติดตาม (Follow-up)
  - ระบบจำกัด 2 รายการ และบันทึกแยกคอลัมน์: รายการที่ 1 → `AT`, รายการที่ 2 → `AU`
- โครงการเปรียบเทียบ (Comparison Projects)
  - ใช้ฟิลด์ `comparisonProjects` แม็พกับคอลัมน์ `AN`

## จุดที่เราแก้/เพิ่มในโปรเจกต์ (สรุป)
- Frontend
  - ใช้ `REACT_APP_API_URL` ผ่านไฟล์ `walk-in-form/src/config.ts` แทน hardcode `localhost`
  - ปุ่มด้านบนแยกเป็น “View List” และ “Create New Customer” (กดแล้วเคลียร์ฟอร์ม)
  - ปุ่ม "AI" ในหน้ารายการ แสดง `AI1–AI4` โดยตรงจากชีต (ทนช่องว่าง/ตัวพิมพ์)
  - ในหน้า Edit มีปุ่ม “ผลการสรุปจาก AI” แสดงค่า `AI1–AI4` เช่นกัน
  - ส่วน Follow‑up ขยายความกว้างช่องรายละเอียด และบันทึกไปคอลัมน์ `AT/AU`
  - Preferences เพิ่มฟิลด์ “โครงการเปรียบเทียบ” (คอลัมน์ `AN`)
- Backend
  - เพิ่มโหมดเสิร์ฟ frontend แบบเลือกได้ด้วย `SERVE_FRONTEND=true` (ปกติปิดไว้)
  - แก้ระบบ Running Number ให้เขียนทั้ง `A` และ `F` และหาค่าสูงสุดจากทั้งสองคอลัมน์
  - ปรับวัน/เดือน/ปี และแปลงปี พ.ศ. → ค.ศ. ตอนอ่านค่า

## Troubleshooting สั้นๆ
- Health Check ได้ OK แต่เว็บโหลดไม่ได้
  - เช็ค Vercel ว่าตั้ง `REACT_APP_API_URL` ถูกหรือไม่
- บันทึกชีทไม่ได้ (Permission denied)
  - ลืมแชร์ชีตให้ Service Account (ดู `client_email` ใน JSON)
- ตัวเลข Running ไม่ต่อ
  - ตรวจว่ามีเลขอยู่ในคอลัมน์ `A` และ `F` บางแถวหรือไม่ (ระบบใช้ค่าสูงสุดจากทั้งสอง)
- ENOENT บน Render (หา build/index.html ไม่เจอ)
  - ปิด `SERVE_FRONTEND` (ไม่ต้องตั้งค่าหรือปล่อยว่าง) เพราะเราเสิร์ฟเว็บจาก Vercel

## คำสั่ง/ลิงก์ที่ใช้บ่อย
- Health: `GET /api/health`
- Entries: `GET /api/walkin/entries`
- Submit: `POST /api/walkin/submit`
- Update: `POST /api/walkin/update`

---
หากต้องการให้รวมค่า `SHEET_NAME` เป็นตัวแปรแวดล้อม (แทนค่า default `Walk-In`) หรือปรับ mapping เพิ่มเติม แจ้งได้เลยครับ ผมสามารถแก้ให้พร้อมคู่มืออัปเดตทันที

