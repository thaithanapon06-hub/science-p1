# คู่มือสร้าง GitHub และเผยแพร่เว็บ (สำหรับผู้เริ่มต้น)

ทำผ่านหน้าเว็บทั้งหมด ไม่ต้องติดตั้งโปรแกรมหรือพิมพ์คำสั่ง ใช้เวลาประมาณ 20–30 นาที
ชื่อปุ่มบนเว็บอาจต่างจากที่เขียนเล็กน้อย ถ้าหาไม่เจอให้ถ่ายภาพหน้าจอไปถาม AI

## ก่อนเริ่ม: เตรียมไฟล์
1. แตกไฟล์ `sci-p1.zip` (Windows: คลิกขวา > Extract All, Mac: ดับเบิลคลิก)
2. ในโฟลเดอร์ต้องมี 13 ไฟล์: index.html, app.js, logic.js, questions.json, firebase-config.js, manifest.json, sw.js, icon-192.png, icon-512.png, firestore.rules, test.mjs, HANDOFF.md, คู่มือ-GitHub.md
3. **firebase-config.js ในไฟล์นี้ยังเป็นค่าว่าง (YOUR_...)** ถ้าคุณใส่ค่า Firebase จริงไว้ในไฟล์เดิมแล้ว ให้ใช้ไฟล์เดิมของคุณแทน หรือแก้หลังอัปโหลดตามขั้นตอนที่ 3

## ขั้นที่ 1: สมัคร GitHub และสร้างที่เก็บไฟล์
1. เข้า github.com กด Sign up สมัครบัญชีฟรี แล้วยืนยันอีเมล
2. **จำ "ชื่อผู้ใช้" (username) ไว้ จะอยู่ในลิงก์เว็บของคุณ**
3. กดปุ่ม **+** มุมขวาบน เลือก **New repository**
4. Repository name: พิมพ์ `science-p1` (ตัวพิมพ์เล็ก ภาษาอังกฤษ ไม่เว้นวรรค)
5. เลือก **Public** (ต้อง Public จึงใช้ Pages ฟรี)
6. ติ๊ก **Add a README file**
7. กด **Create repository**

## ขั้นที่ 2: อัปโหลดไฟล์
1. ในหน้า repository กด **Add file** > **Upload files**
2. เปิดโฟลเดอร์ที่แตกไฟล์ไว้ กด Ctrl+A (Mac: Cmd+A) เลือกทุกไฟล์
3. ลากมาวางในหน้าเว็บ **ลากเป็นไฟล์ ไม่ใช่ลากตัวโฟลเดอร์** (ไฟล์ต้องอยู่ชั้นนอกสุดของ repository)
4. รอจนทุกไฟล์ขึ้นรายการ เลื่อนลงกด **Commit changes**
5. กลับหน้าแรกของ repository ตรวจว่าเห็น index.html อยู่ชั้นนอกสุด ไม่ได้ซ่อนในโฟลเดอร์

## ขั้นที่ 3: ใส่ค่า Firebase (ถ้ายังเป็น YOUR_...)
1. คัดลอกค่าจาก Firebase Console > Project settings (เฟือง) > Your apps > ส่วน Config (apiKey, authDomain, projectId, appId)
2. ใน GitHub คลิกไฟล์ `firebase-config.js` > กดไอคอนดินสอ (Edit this file)
3. แทนค่า YOUR_API_KEY, YOUR_PROJECT.firebaseapp.com, YOUR_PROJECT, YOUR_APP_ID ด้วยค่าจริง **คงเครื่องหมายคำพูด " " ไว้**
4. กด **Commit changes**

## ขั้นที่ 4: เปิดเป็นเว็บไซต์ (GitHub Pages)
1. ใน repository กดแท็บ **Settings**
2. เมนูซ้าย เลือก **Pages**
3. Source: **Deploy from a branch**; Branch: `main` และโฟลเดอร์ `/ (root)` กด **Save**
4. รอ 1–3 นาที รีเฟรชหน้านั้น จะเห็นลิงก์ `https://ชื่อผู้ใช้.github.io/science-p1/`

## ขั้นที่ 5: อนุญาตโดเมนใน Firebase (ห้ามข้าม)
1. Firebase Console > Authentication > แท็บ **Settings** > **Authorized domains**
2. กด **Add domain** ใส่ `ชื่อผู้ใช้.github.io` อย่างเดียว (ไม่มี https:// และไม่มี /science-p1)
3. ถ้าข้ามขั้นนี้ ล็อกอินจะขึ้น `auth/unauthorized-domain`

## ขั้นที่ 6: ทดสอบ
เปิดลิงก์ (ใช้ได้ทั้งมือถือและคอมพิวเตอร์) แล้วตรวจตามรายการ
- [ ] ล็อกอินด้วย Google ได้
- [ ] เห็น 6 บท บท 1 กดได้ บท 2–6 มีกุญแจ
- [ ] ทำก่อนเรียนแล้วเข้าสื่อการสอนได้ทันที
- [ ] ปุ่มแบบฝึกหัดล็อกจนวิดีโอเล่นจบ
- [ ] แบบฝึกหัด: ข้อผิดวนกลับมา ข้อถูกไม่กลับมา ถูกครบแล้วไปหลังเรียน
- [ ] หลังเรียน ได้ต่ำกว่า 60% ไม่ปลดล็อก / ตั้งแต่ 60% ขึ้นไป ปลดล็อกบทถัดไป
- [ ] Firestore มีเอกสาร progress/{uid}/chapters/ch1 พร้อมคะแนนและเวลาเรียน

เฉลยคำถามตัวอย่าง: ข้อ 1 = ก, ข้อ 2 = ข, ข้อ 3 = ค
(ได้ 3/3 = 100%, 2/3 = 67% ผ่าน, 1/3 = 33% ไม่ผ่าน)

## เมื่อแก้ไฟล์ภายหลัง
Add file > Upload files > ลากไฟล์ใหม่ชื่อเดียวกันมาทับ > Commit รอ 1–2 นาที แล้วเปิดเว็บใหม่
(มือถือ: ปิดแท็บแล้วเปิดใหม่ ถ้ายังเห็นของเก่า)

## ปัญหาที่พบบ่อย
| อาการ | วิธีแก้ |
|---|---|
| เว็บขึ้น 404 | ตรวจว่า index.html อยู่ชั้นนอกสุด และ Pages ตั้งเป็น main / root แล้วรอสักครู่ |
| หน้าขาว | กด F12 > Console ถ่ายภาพข้อความสีแดงมาถาม |
| ล็อกอินขึ้น unauthorized-domain | ทำขั้นที่ 5 |
| ล็อกอินขึ้น api-key-not-valid | ตรวจ firebase-config.js ว่าใส่ค่าครบและถูกต้อง |
| เห็นบทไม่ครบ / ไม่เห็นบท | ตรวจ Firestore: คอลเลกชัน chapters, Document ID ch1–ch6, order เป็น number |
| ไม่มีคำถามในบท | Document ID ต้องตรงกับ ch1–ch6 |
| ขึ้น Missing or insufficient permissions | ยังไม่ได้ Publish ไฟล์ firestore.rules ในแท็บ Rules ของ Firestore |
