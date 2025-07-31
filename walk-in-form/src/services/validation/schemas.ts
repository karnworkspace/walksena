
import * as Yup from 'yup';

export const step1Schema = Yup.object({
  visitDate: Yup.date()
    .required('กรุณาเลือกวันที่เข้าชมโครงการ')
    .max(new Date(), 'วันที่ไม่สามารถเป็นอนาคตได้')
    .min(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'วันที่ไม่เกิน 30 วันที่ผ่านมา'),
  
  salesQueue: Yup.string()
    .required('กรุณาเลือก Sales ผู้ดูแล')
    .oneOf(['A', 'Lukpla', 'Pare'], 'Sales ผู้ดูแลไม่ถูกต้อง'),
  
  walkInType: Yup.string()
    .required('กรุณาเลือกประเภท Walk-in')
    .oneOf(['Appointment', 'Pass site', 're visit'], 'ประเภท Walk-in ไม่ถูกต้อง')
});

export const step2Schema = Yup.object({
  fullName: Yup.string()
    .required('กรุณากรอกชื่อ-นามสกุล')
    .min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(100, 'ชื่อต้องไม่เกิน 100 ตัวอักษร'),
  
  phoneNumber: Yup.string()
    .required('กรุณากรอกหมายเลขโทรศัพท์')
    .matches(/^[0-9]{9,10}$/, 'หมายเลขโทรศัพท์ไม่ถูกต้อง'),
  
  email: Yup.string()
    .email('รูปแบบ Email ไม่ถูกต้อง')
    .nullable(),
  
  age: Yup.number()
    .min(18, 'อายุต้องมากกว่า 18 ปี')
    .max(80, 'อายุต้องไม่เกิน 80 ปี')
    .nullable()
});

// We can add schemas for other steps later
export const step3Schema = Yup.object({});
export const step4Schema = Yup.object({});
export const step5Schema = Yup.object({});
