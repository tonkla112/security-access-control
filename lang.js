(function(){
  var STORE='ac_lang';
  var LANGS={th:'TH',zh:'中文',en:'EN'};
  var originalText=new WeakMap();
  var originalAttrs=new WeakMap();
  var running=false;
  var title0=document.title;

  var exact={
    zh:{
      'Security Access Control · ZG Industries':'安防出入管理 · ZG Industries',
      'ควบคุมการเข้า-ออกผู้รับเหมา':'承包商出入管理',
      'SECURITY ACCESS CONTROL · 门禁控制系统':'SECURITY ACCESS CONTROL · 门禁控制系统',
      'อยู่ในพื้นที่':'当前在场',
      'เข้าวันนี้':'今日进入',
      'บัตรใช้งานได้':'有效卡',
      'ใกล้หมดอายุ':'即将到期',
      'ป้อมยาม · สแกนเข้า-ออก':'保安岗 · 扫码进出',
      'สแกนบัตร/QR/เบอร์โทร ตรวจสอบสิทธิ์ ถ่ายรูป บันทึกเข้า-ออก':'扫描卡/QR/电话，验证权限，拍照并记录进出',
      'สำหรับ รปภ.':'保安使用',
      'Dashboard ศูนย์ควบคุม':'控制中心 Dashboard',
      'KPI สด ฟีดเข้า-ออก รายการอยู่ในพื้นที่ รีเฟรชทุก 60 วิ':'实时 KPI、进出动态、在场名单，每 60 秒刷新',
      'ผู้บริหาร / HR':'管理层 / HR',
      'ลงทะเบียนผู้รับเหมา':'承包商登记',
      'ออกรหัสบัตร CTR อัตโนมัติ พร้อม QR ทันทีที่ลงทะเบียนเสร็จ':'登记完成后自动生成 CTR 卡号和 QR',
      'พิมพ์บัตร Contractor':'打印承包商卡',
      'บัตร CR80 พร้อม QR 3 ภาษา เลือกใบที่ต้องการ พิมพ์ A4 ตัดใช้ได้เลย':'CR80 卡片含三语 QR，可选择后用 A4 打印裁切',
      'รายงานรายเดือน HR/Safety':'HR/Safety 月报',
      'สถิติเข้า-ออก photo compliance รายการค้างในพื้นที่ พิมพ์ PDF':'进出统计、照片合规、未离场记录，可打印 PDF',
      'ตั้งค่า · จัดการบัตร':'设置 · 卡片管理',
      'ต่ออายุ/ระงับบัตร ดู QR รายใบ ตั้งค่า webhook ของเครื่อง':'续期/停用卡片、查看 QR、设置本机 webhook',
      'สแกน QR':'扫描 QR',
      'เปิดกล้องสแกน QR บนบัตร เด้งกลับหน้าป้อมยามพร้อมตรวจสอบ':'打开相机扫描卡片 QR，并返回岗亭页验证',
      'ข้อมูลดิบ (Google Sheet)':'原始数据 (Google Sheet)',
      'AccessLog + Contractors เปิดดู/แก้ไขข้อมูลต้นทางโดยตรง':'直接打开/编辑 AccessLog 与 Contractors 原始数据',
      'Admin':'管理员',
      'เวอร์ชันเดโม่เดิม':'旧版演示',
      'หน้าหลัก':'主页',
      'ป้อมยาม':'保安岗',
      'ลงทะเบียน':'登记',
      'พิมพ์บัตร':'打印卡片',
      'รายงาน':'报表',
      'ตั้งค่า':'设置',
      'จุดใช้งาน':'使用地点',
      'Security dashboard':'安防看板',
      'กำลังโหลดข้อมูล...':'正在加载数据...',
      'รีเฟรช':'刷新',
      'อยู่ในพื้นที่ตอนนี้':'当前在场',
      'รอข้อมูลสด':'等待实时数据',
      'รายการเข้า':'进入记录',
      'รายการออก':'离开记录',
      'จากทะเบียนผู้รับเหมา':'来自承包商登记表',
      'ภายใน 30 วัน':'30 天内',
      'ฟีดเข้า-ออกล่าสุด':'最新进出动态',
      'เวลา':'时间',
      'บริษัท':'公司',
      'ประเภท':'类型',
      'ทะเบียน':'车牌',
      'ประตู':'门',
      'รปภ.':'保安',
      'อยู่ในพื้นที่':'在场名单',
      'ปริมาณรายชั่วโมงวันนี้':'今日每小时流量',
      'รีเฟรชอัตโนมัติทุก 60 วินาที':'每 60 秒自动刷新',
      'ยังไม่โหลดข้อมูล':'尚未加载数据',
      'ป้อมยาม · เข้า-ออก':'保安岗 · 进出',
      'RFID / QR ACCESS':'RFID / QR 出入',
      'ตรวจบัตรผู้รับเหมา':'验证承包商卡',
      'ตรวจ':'验证',
      'รายละเอียดเข้า-ออก':'进出详情',
      'เข้า':'进入',
      'ออก':'离开',
      'ทะเบียนรถ':'车牌号',
      'จำนวนคน':'人数',
      'ผู้ติดต่อ / แผนก':'联系人 / 部门',
      'รปภ. / จุดป้อม':'保安 / 岗位',
      'รูปประกอบ (ไม่บังคับ)':'照片附件（可选）',
      'รูปรถ':'车辆照片',
      'รูปบุคคล':'人员照片',
      'รูปสิ่งของ':'物品照片',
      'บันทึกเข้า-ออก':'保存进出记录',
      'บันทึกเข้า':'保存进入',
      'บันทึกออก':'保存离开',
      'ใช้งานได้':'有效',
      'หมดอายุ':'已过期',
      'ปฏิเสธ':'拒绝',
      'ใส่รหัส PIN':'输入 PIN',
      'หน้านี้สำหรับเจ้าหน้าที่ที่ได้รับอนุญาตเท่านั้น':'此页面仅限授权人员使用',
      'ปลดล็อก':'解锁',
      'ตั้งค่าระบบ':'系统设置',
      'URL ปัจจุบันของเครื่องนี้':'此设备当前 URL',
      'Admin token ของเครื่องนี้':'此设备 Admin token',
      'ชื่อผู้แก้ไข / จุดใช้งานเครื่องนี้':'操作员 / 此设备位置',
      'บันทึก':'保存',
      'ทดสอบการเชื่อมต่อ':'测试连接',
      'คืนค่าเริ่มต้น':'恢复默认',
      'จัดการบัตรผู้รับเหมา':'承包商卡管理',
      'โหลดใหม่':'重新加载',
      'กำลังโหลดทะเบียน...':'正在加载登记表...',
      'หน้าป้อมยาม':'保安岗页面',
      'แสดง QR ที่ป้อมยามเพื่อสแกนเข้า-ออก':'在岗亭出示此 QR 以扫描进出',
      'ปิด':'关闭',
      'บริษัท / หน่วยงาน':'公司 / 单位',
      'ชื่อ-นามสกุล ผู้ปฏิบัติงาน':'作业人员姓名',
      'เลขบัตร ปชช. (4 ตัวท้าย)':'身份证后 4 位',
      'เบอร์โทร':'电话',
      'ประเภทงาน':'工作类型',
      'เริ่มเข้าพื้นที่':'开始日期',
      'หมดอายุ':'已过期',
      'ผู้ติดต่อภายใน':'内部联系人',
      'แผนก':'部门',
      'ลงทะเบียนสำเร็จ':'登记成功',
      'พิมพ์บัตร':'打印卡片',
      'ลงทะเบียนรายต่อไป':'登记下一位',
      'ก่อสร้าง/ต่อเติม':'施工/改造',
      'ไฟฟ้า':'电气',
      'เครื่องกล/ซ่อมบำรุง':'机械/维修',
      'ขนส่ง':'运输',
      'ทำความสะอาด':'清洁',
      'สวน/ภูมิทัศน์':'园艺/景观',
      'อื่น ๆ':'其他',
      'สแกน QR ผู้รับเหมา':'扫描承包商 QR',
      'กำลังเปิดกล้อง... (อนุญาตการใช้กล้องเมื่อเบราว์เซอร์ถาม)':'正在打开相机...（浏览器询问时请允许使用相机）',
      'กลับหน้าป้อมยาม':'返回保安岗',
      'พิมพ์บัตร Contractor พร้อม QR':'打印带 QR 的承包商卡',
      'เลือกทั้งหมด':'全选',
      'ไม่เลือกเลย':'全不选',
      'พิมพ์บัตรที่เลือก':'打印所选卡片',
      'กำลังโหลดทะเบียนผู้รับเหมา...':'正在加载承包商登记表...',
      'รายงานสรุปรายเดือน · Security Access Control':'月度汇总报表 · Security Access Control',
      'โหลด':'加载',
      'พิมพ์ / PDF':'打印 / PDF',
      'เลือกเดือนแล้วกด "โหลด"':'选择月份后点击“加载”',
      'ภาพรวมประจำเดือน':'月度概览',
      'ปริมาณเข้า-ออกรายวัน':'每日进出量',
      'สรุปรายบริษัท':'按公司汇总',
      'อัตราการถ่ายรูปประกอบ (Photo compliance)':'照片合规率',
      'รายการค้างในพื้นที่ (บันทึกเข้า ไม่มีบันทึกออก)':'未离场记录（有进入无离开）',
      'สถานะบัตรผู้รับเหมา (ณ วันออกรายงาน)':'承包商卡状态（报表生成日）',
      'ผู้จัดทำรายงาน (Security / HR)':'报表制作人（Security / HR）',
      'ผู้ตรวจสอบ (Safety Manager)':'审核人（Safety Manager）',
      'ข้อมูลดิบ Google Sheet — เฉพาะเจ้าหน้าที่ที่ได้รับอนุญาต':'Google Sheet 原始数据 — 仅限授权人员',
      'ปลดล็อก → เปิดชีท':'解锁 → 打开表格'
    },
    en:{
      'Security Access Control · ZG Industries':'Security Access Control · ZG Industries',
      'ควบคุมการเข้า-ออกผู้รับเหมา':'Contractor Access Control',
      'SECURITY ACCESS CONTROL · 门禁控制系统':'SECURITY ACCESS CONTROL',
      'อยู่ในพื้นที่':'On-site',
      'เข้าวันนี้':'Today In',
      'บัตรใช้งานได้':'Active Cards',
      'ใกล้หมดอายุ':'Expiring Soon',
      'ป้อมยาม · สแกนเข้า-ออก':'Guard Gate · Check In/Out',
      'สแกนบัตร/QR/เบอร์โทร ตรวจสอบสิทธิ์ ถ่ายรูป บันทึกเข้า-ออก':'Scan card/QR/phone, verify access, take photos, and log movement',
      'สำหรับ รปภ.':'For Security',
      'Dashboard ศูนย์ควบคุม':'Control Dashboard',
      'KPI สด ฟีดเข้า-ออก รายการอยู่ในพื้นที่ รีเฟรชทุก 60 วิ':'Live KPIs, access feed, on-site list, refreshes every 60 seconds',
      'ผู้บริหาร / HR':'Management / HR',
      'ลงทะเบียนผู้รับเหมา':'Contractor Registration',
      'ออกรหัสบัตร CTR อัตโนมัติ พร้อม QR ทันทีที่ลงทะเบียนเสร็จ':'Automatically creates a CTR card number and QR after registration',
      'พิมพ์บัตร Contractor':'Print Contractor Cards',
      'บัตร CR80 พร้อม QR 3 ภาษา เลือกใบที่ต้องการ พิมพ์ A4 ตัดใช้ได้เลย':'CR80 cards with trilingual QR, print selected cards on A4 and cut',
      'รายงานรายเดือน HR/Safety':'Monthly HR/Safety Report',
      'สถิติเข้า-ออก photo compliance รายการค้างในพื้นที่ พิมพ์ PDF':'Access stats, photo compliance, unresolved on-site records, printable PDF',
      'ตั้งค่า · จัดการบัตร':'Settings · Card Management',
      'ต่ออายุ/ระงับบัตร ดู QR รายใบ ตั้งค่า webhook ของเครื่อง':'Renew/disable cards, view individual QR, configure this device webhook',
      'สแกน QR':'Scan QR',
      'เปิดกล้องสแกน QR บนบัตร เด้งกลับหน้าป้อมยามพร้อมตรวจสอบ':'Open camera to scan card QR and return to the guard page for verification',
      'ข้อมูลดิบ (Google Sheet)':'Raw Data (Google Sheet)',
      'AccessLog + Contractors เปิดดู/แก้ไขข้อมูลต้นทางโดยตรง':'Open/edit source AccessLog and Contractors data directly',
      'Admin':'Admin',
      'เวอร์ชันเดโม่เดิม':'Old demo version',
      'หน้าหลัก':'Home',
      'ป้อมยาม':'Guard',
      'ลงทะเบียน':'Register',
      'พิมพ์บัตร':'Print Cards',
      'รายงาน':'Report',
      'ตั้งค่า':'Settings',
      'จุดใช้งาน':'Station',
      'Security dashboard':'Security dashboard',
      'กำลังโหลดข้อมูล...':'Loading data...',
      'รีเฟรช':'Refresh',
      'อยู่ในพื้นที่ตอนนี้':'On-site now',
      'รอข้อมูลสด':'Waiting for live data',
      'รายการเข้า':'Entry records',
      'รายการออก':'Exit records',
      'จากทะเบียนผู้รับเหมา':'From contractor registry',
      'ภายใน 30 วัน':'Within 30 days',
      'ฟีดเข้า-ออกล่าสุด':'Latest Access Feed',
      'เวลา':'Time',
      'บริษัท':'Company',
      'ประเภท':'Type',
      'ทะเบียน':'Plate',
      'ประตู':'Gate',
      'รปภ.':'Guard',
      'อยู่ในพื้นที่':'On-site',
      'ปริมาณรายชั่วโมงวันนี้':'Today Hourly Traffic',
      'รีเฟรชอัตโนมัติทุก 60 วินาที':'Auto refresh every 60 seconds',
      'ยังไม่โหลดข้อมูล':'Not loaded yet',
      'ป้อมยาม · เข้า-ออก':'Guard Gate · In/Out',
      'RFID / QR ACCESS':'RFID / QR ACCESS',
      'ตรวจบัตรผู้รับเหมา':'Verify Contractor Card',
      'ตรวจ':'Check',
      'รายละเอียดเข้า-ออก':'Access Details',
      'เข้า':'In',
      'ออก':'Out',
      'ทะเบียนรถ':'Vehicle Plate',
      'จำนวนคน':'People',
      'ผู้ติดต่อ / แผนก':'Contact / Department',
      'รปภ. / จุดป้อม':'Guard / Gate Point',
      'รูปประกอบ (ไม่บังคับ)':'Photos (optional)',
      'รูปรถ':'Vehicle Photo',
      'รูปบุคคล':'Person Photo',
      'รูปสิ่งของ':'Goods Photo',
      'บันทึกเข้า-ออก':'Save In/Out',
      'บันทึกเข้า':'Save Entry',
      'บันทึกออก':'Save Exit',
      'ใช้งานได้':'Active',
      'หมดอายุ':'Expired',
      'ปฏิเสธ':'Denied',
      'ใส่รหัส PIN':'Enter PIN',
      'หน้านี้สำหรับเจ้าหน้าที่ที่ได้รับอนุญาตเท่านั้น':'This page is for authorized staff only',
      'ปลดล็อก':'Unlock',
      'ตั้งค่าระบบ':'System Settings',
      'URL ปัจจุบันของเครื่องนี้':'Current URL on this device',
      'Admin token ของเครื่องนี้':'Admin token on this device',
      'ชื่อผู้แก้ไข / จุดใช้งานเครื่องนี้':'Operator / device station',
      'บันทึก':'Save',
      'ทดสอบการเชื่อมต่อ':'Test Connection',
      'คืนค่าเริ่มต้น':'Restore Default',
      'จัดการบัตรผู้รับเหมา':'Contractor Card Management',
      'โหลดใหม่':'Reload',
      'กำลังโหลดทะเบียน...':'Loading registry...',
      'หน้าป้อมยาม':'Guard Page',
      'แสดง QR ที่ป้อมยามเพื่อสแกนเข้า-ออก':'Show this QR at the gate for check in/out',
      'ปิด':'Close',
      'บริษัท / หน่วยงาน':'Company / Organization',
      'ชื่อ-นามสกุล ผู้ปฏิบัติงาน':'Worker Full Name',
      'เลขบัตร ปชช. (4 ตัวท้าย)':'ID Card Last 4 Digits',
      'เบอร์โทร':'Phone',
      'ประเภทงาน':'Work Type',
      'เริ่มเข้าพื้นที่':'Start Date',
      'หมดอายุ':'Expired',
      'ผู้ติดต่อภายใน':'Internal Contact',
      'แผนก':'Department',
      'ลงทะเบียนสำเร็จ':'Registration Complete',
      'พิมพ์บัตร':'Print Card',
      'ลงทะเบียนรายต่อไป':'Register Next',
      'ก่อสร้าง/ต่อเติม':'Construction/Modification',
      'ไฟฟ้า':'Electrical',
      'เครื่องกล/ซ่อมบำรุง':'Mechanical/Maintenance',
      'ขนส่ง':'Transport',
      'ทำความสะอาด':'Cleaning',
      'สวน/ภูมิทัศน์':'Garden/Landscape',
      'อื่น ๆ':'Other',
      'สแกน QR ผู้รับเหมา':'Scan Contractor QR',
      'กำลังเปิดกล้อง... (อนุญาตการใช้กล้องเมื่อเบราว์เซอร์ถาม)':'Opening camera... allow camera access when asked',
      'กลับหน้าป้อมยาม':'Back to Guard Page',
      'พิมพ์บัตร Contractor พร้อม QR':'Print Contractor Cards with QR',
      'เลือกทั้งหมด':'Select All',
      'ไม่เลือกเลย':'Select None',
      'พิมพ์บัตรที่เลือก':'Print Selected Cards',
      'กำลังโหลดทะเบียนผู้รับเหมา...':'Loading contractor registry...',
      'รายงานสรุปรายเดือน · Security Access Control':'Monthly Summary Report · Security Access Control',
      'โหลด':'Load',
      'พิมพ์ / PDF':'Print / PDF',
      'เลือกเดือนแล้วกด "โหลด"':'Choose a month and click "Load"',
      'ภาพรวมประจำเดือน':'Monthly Overview',
      'ปริมาณเข้า-ออกรายวัน':'Daily In/Out Volume',
      'สรุปรายบริษัท':'Company Summary',
      'อัตราการถ่ายรูปประกอบ (Photo compliance)':'Photo Compliance',
      'รายการค้างในพื้นที่ (บันทึกเข้า ไม่มีบันทึกออก)':'Unclosed On-site Records (entry without exit)',
      'สถานะบัตรผู้รับเหมา (ณ วันออกรายงาน)':'Contractor Card Status (as of report date)',
      'ผู้จัดทำรายงาน (Security / HR)':'Prepared by (Security / HR)',
      'ผู้ตรวจสอบ (Safety Manager)':'Reviewed by (Safety Manager)',
      'ข้อมูลดิบ Google Sheet — เฉพาะเจ้าหน้าที่ที่ได้รับอนุญาต':'Google Sheet raw data — authorized staff only',
      'ปลดล็อก → เปิดชีท':'Unlock → Open Sheet'
    }
  };

  var placeholders={
    zh:{
      'CTR-0001 หรือสแกน QR':'CTR-0001 或扫描 QR',
      'เช่น 2กก 1847':'例如 2กก 1847',
      '1':'1',
      'ชื่อผู้ติดต่อ หรือแผนก':'联系人或部门',
      'เช่น ป้อม 1':'例如 1 号岗',
      'ตั้งค่าให้ตรงกับ Script Property ADMIN_TOKEN':'需与 Script Property ADMIN_TOKEN 一致',
      'เช่น HR Office หรือ ป้อม 1':'例如 HR Office 或 1 号岗',
      'เช่น รุ่งเรือง เอ็นจิเนียริ่ง จำกัด':'例如 Rungrueang Engineering Co., Ltd.',
      'เช่น สมชาย ใจดี':'例如 Somchai Jaidee',
      'เช่น 1234':'例如 1234',
      'เช่น 0812345678':'例如 0812345678',
      'เช่น คุณวิภา':'例如 Wipa',
      'เช่น Facility':'例如 Facility'
    },
    en:{
      'CTR-0001 หรือสแกน QR':'CTR-0001 or scan QR',
      'เช่น 2กก 1847':'e.g. 2กก 1847',
      '1':'1',
      'ชื่อผู้ติดต่อ หรือแผนก':'Contact name or department',
      'เช่น ป้อม 1':'e.g. Gate 1',
      'ตั้งค่าให้ตรงกับ Script Property ADMIN_TOKEN':'Must match Script Property ADMIN_TOKEN',
      'เช่น HR Office หรือ ป้อม 1':'e.g. HR Office or Gate 1',
      'เช่น รุ่งเรือง เอ็นจิเนียริ่ง จำกัด':'e.g. Rungrueang Engineering Co., Ltd.',
      'เช่น สมชาย ใจดี':'e.g. Somchai Jaidee',
      'เช่น 1234':'e.g. 1234',
      'เช่น 0812345678':'e.g. 0812345678',
      'เช่น คุณวิภา':'e.g. Wipa',
      'เช่น Facility':'e.g. Facility'
    }
  };

  var phrases={
    zh:{
      'กำลังโหลดข้อมูล':'正在加载数据',
      'เชื่อมต่อสำเร็จ':'连接成功',
      'เชื่อมต่อไม่ได้':'无法连接',
      'ยังไม่ได้ตั้ง Admin token':'尚未设置 Admin token',
      'กรุณาไปหน้า Settings แล้วบันทึก Admin token ก่อนใช้งาน Dashboard':'请先到 Settings 保存 Admin token 后再使用 Dashboard',
      'โหลด Dashboard ไม่สำเร็จ':'Dashboard 加载失败',
      'ยังไม่มีรายการเข้า-ออก':'暂无进出记录',
      'ไม่มีผู้รับเหมาค้างอยู่ในพื้นที่':'当前没有承包商留在区域内',
      'ยังไม่มีข้อมูลรายชั่วโมงวันนี้':'今日暂无小时数据',
      'ยังไม่มีข้อมูลให้แสดง':'暂无可显示数据',
      'อัปเดตล่าสุด':'最后更新',
      'รายการ':'条',
      'ครั้ง':'次',
      'ประตู 1':'1 号门',
      'ประตู 2':'2 号门',
      'ประตู 3':'3 号门',
      'ประตู 4':'4 号门',
      'ยังไม่ได้ตั้ง token: ไปหน้า Settings ก่อนใช้งานหน้าป้อมยาม':'尚未设置 token：请先到 Settings 再使用保安岗页面',
      'โหลดทะเบียนไม่ได้':'无法加载登记表',
      'โหลดทะเบียนไม่สำเร็จ':'登记表加载失败',
      'ไม่พบบัตรในระบบ':'系统中未找到此卡',
      'ตรวจเลขบัตรอีกครั้ง หรือให้ HR ลงทะเบียนก่อน':'请再次检查卡号，或请 HR 先登记',
      'กำลังบันทึก':'正在保存',
      'ส่งบันทึกแล้ว':'记录已发送',
      'บันทึกไม่สำเร็จ':'保存失败',
      'บันทึกแล้ว (มีผลเฉพาะเครื่องนี้)':'已保存（仅此设备生效）',
      'กำลังทดสอบ':'正在测试',
      'ตอบกลับไม่ถูกต้อง':'返回内容不正确',
      'กรอก Admin token ก่อนทดสอบการเชื่อมต่อ':'测试连接前请填写 Admin token',
      'กรอก Admin token แล้วกดบันทึกก่อนโหลดทะเบียน':'填写 Admin token 并保存后再加载登记表',
      'ยังไม่มีผู้รับเหมาลงทะเบียน':'尚无承包商登记',
      'โหลดไม่สำเร็จ':'加载失败',
      'เลือกวันหมดอายุก่อน':'请先选择到期日',
      'ระงับบัตร':'停用卡片',
      'ระงับไม่สำเร็จ':'停用失败',
      'วันหมดอายุต้องไม่ก่อนวันเริ่ม':'到期日不能早于开始日',
      'กำลังเปิดกล้อง':'正在打开相机',
      'สแกน QR ผู้รับเหมา':'扫描承包商 QR',
      'กลับหน้าป้อมยาม':'返回保安岗',
      'เล็ง QR ให้อยู่ในกรอบ':'请将 QR 对准框内',
      'เปิดกล้องไม่ได้':'无法打开相机',
      'กำลังตรวจสอบ':'正在验证',
      'ยังไม่มีผู้รับเหมาในทะเบียน':'登记表中暂无承包商',
      'ทั้งหมด':'全部',
      'ติ๊กเลือกใบที่ต้องการ':'勾选需要的卡片',
      'ยังไม่มีข้อมูลในเดือนนี้':'本月暂无数据',
      'ครบ 3 รูป':'3 张照片齐全',
      'มีบางรูป':'有部分照片',
      'ไม่มีรูป':'无照片',
      'ไม่มีรายการค้าง':'无未离场记录',
      'ไม่มีบัตรใกล้หมดอายุใน 30 วัน':'30 天内无即将到期卡片',
      'บัตรทั้งหมด':'全部卡片',
      'หมดอายุแล้ว':'已过期',
      'ใกล้หมดอายุ ≤30 วัน':'30 天内到期'
    },
    en:{
      'กำลังโหลดข้อมูล':'Loading data',
      'เชื่อมต่อสำเร็จ':'Connected',
      'เชื่อมต่อไม่ได้':'Connection failed',
      'ยังไม่ได้ตั้ง Admin token':'Admin token is not set',
      'กรุณาไปหน้า Settings แล้วบันทึก Admin token ก่อนใช้งาน Dashboard':'Please go to Settings and save the Admin token before using Dashboard',
      'โหลด Dashboard ไม่สำเร็จ':'Dashboard failed to load',
      'ยังไม่มีรายการเข้า-ออก':'No access records yet',
      'ไม่มีผู้รับเหมาค้างอยู่ในพื้นที่':'No contractors remain on-site',
      'ยังไม่มีข้อมูลรายชั่วโมงวันนี้':'No hourly data today',
      'ยังไม่มีข้อมูลให้แสดง':'No data to display',
      'อัปเดตล่าสุด':'Last updated',
      'รายการ':'items',
      'ครั้ง':'times',
      'ประตู 1':'Gate 1',
      'ประตู 2':'Gate 2',
      'ประตู 3':'Gate 3',
      'ประตู 4':'Gate 4',
      'ยังไม่ได้ตั้ง token: ไปหน้า Settings ก่อนใช้งานหน้าป้อมยาม':'Token is not set: go to Settings before using the guard page',
      'โหลดทะเบียนไม่ได้':'Could not load registry',
      'โหลดทะเบียนไม่สำเร็จ':'Registry failed to load',
      'ไม่พบบัตรในระบบ':'Card not found',
      'ตรวจเลขบัตรอีกครั้ง หรือให้ HR ลงทะเบียนก่อน':'Check the card number again or ask HR to register first',
      'กำลังบันทึก':'Saving',
      'ส่งบันทึกแล้ว':'Record sent',
      'บันทึกไม่สำเร็จ':'Save failed',
      'บันทึกแล้ว (มีผลเฉพาะเครื่องนี้)':'Saved (this device only)',
      'กำลังทดสอบ':'Testing',
      'ตอบกลับไม่ถูกต้อง':'Unexpected response',
      'กรอก Admin token ก่อนทดสอบการเชื่อมต่อ':'Enter Admin token before testing connection',
      'กรอก Admin token แล้วกดบันทึกก่อนโหลดทะเบียน':'Enter Admin token and save before loading registry',
      'ยังไม่มีผู้รับเหมาลงทะเบียน':'No contractors registered yet',
      'โหลดไม่สำเร็จ':'Load failed',
      'เลือกวันหมดอายุก่อน':'Choose an expiry date first',
      'ระงับบัตร':'Disable card',
      'ระงับไม่สำเร็จ':'Disable failed',
      'วันหมดอายุต้องไม่ก่อนวันเริ่ม':'Expiry date cannot be before start date',
      'กำลังเปิดกล้อง':'Opening camera',
      'สแกน QR ผู้รับเหมา':'Scan Contractor QR',
      'กลับหน้าป้อมยาม':'Back to Guard Page',
      'เล็ง QR ให้อยู่ในกรอบ':'Place the QR inside the frame',
      'เปิดกล้องไม่ได้':'Could not open camera',
      'กำลังตรวจสอบ':'Checking',
      'ยังไม่มีผู้รับเหมาในทะเบียน':'No contractors in registry',
      'ทั้งหมด':'Total',
      'ติ๊กเลือกใบที่ต้องการ':'Tick the cards you want',
      'ยังไม่มีข้อมูลในเดือนนี้':'No data this month',
      'ครบ 3 รูป':'All 3 photos',
      'มีบางรูป':'Some photos',
      'ไม่มีรูป':'No photos',
      'ไม่มีรายการค้าง':'No unclosed records',
      'ไม่มีบัตรใกล้หมดอายุใน 30 วัน':'No cards expiring within 30 days',
      'บัตรทั้งหมด':'Total cards',
      'หมดอายุแล้ว':'Expired',
      'ใกล้หมดอายุ ≤30 วัน':'Expiring ≤30 days'
    }
  };

  function lang(){
    try{return localStorage.getItem(STORE)||'th'}catch(e){return 'th'}
  }
  function setLang(v){
    try{localStorage.setItem(STORE,v)}catch(e){}
    apply(v);
  }
  function trExact(s,l){
    if(l==='th')return s;
    var map=exact[l]||{};
    return map[s]||s;
  }
  function trPhrase(s,l){
    if(l==='th')return s;
    var out=trExact(s,l);
    if(out!==s)return out;
    var map=phrases[l]||{};
    Object.keys(map).sort(function(a,b){return b.length-a.length}).forEach(function(k){
      out=out.split(k).join(map[k]);
    });
    return out;
  }
  function translateText(s,l){
    if(!s || !s.trim())return s;
    var lead=s.match(/^\s*/)[0], tail=s.match(/\s*$/)[0], core=s.trim();
    return lead+trPhrase(core,l)+tail;
  }
  function eachText(root,fn){
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
      acceptNode:function(n){
        var p=n.parentNode;
        if(!p)return NodeFilter.FILTER_REJECT;
        var tag=p.nodeName;
        if(tag==='SCRIPT'||tag==='STYLE'||tag==='TEXTAREA'||tag==='OPTION'&&p.disabled)return NodeFilter.FILTER_REJECT;
        if(p.closest && p.closest('.ac-lang-switch'))return NodeFilter.FILTER_REJECT;
        return n.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
      }
    });
    var nodes=[],n;
    while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(fn);
  }
  function applyAttrs(root,l){
    var attrs=['placeholder','title','aria-label'];
    root.querySelectorAll && root.querySelectorAll('*').forEach(function(el){
      if(el.closest && el.closest('.ac-lang-switch'))return;
      var store=originalAttrs.get(el)||{};
      attrs.forEach(function(a){
        if(!el.hasAttribute(a))return;
        if(!store[a])store[a]=el.getAttribute(a);
        var base=store[a];
        var map=placeholders[l]||{};
        el.setAttribute(a,l==='th'?base:(map[base]||trPhrase(base,l)));
      });
      if(Object.keys(store).length)originalAttrs.set(el,store);
    });
  }
  function createSwitcher(){
    if(document.querySelector('.ac-lang-switch'))return;
    var style=document.createElement('style');
    style.textContent=".ac-lang-switch{position:fixed;right:12px;top:12px;z-index:100001;display:flex;gap:4px;padding:4px;background:rgba(255,255,255,.92);border:1px solid rgba(22,36,61,.14);border-radius:999px;box-shadow:0 8px 28px -18px rgba(15,27,48,.5);backdrop-filter:blur(8px)}.ac-lang-switch button{border:0;border-radius:999px;background:transparent;color:#16243d;font:700 11.5px/1 'IBM Plex Sans Thai','Noto Sans SC',sans-serif;padding:7px 9px;cursor:pointer;min-width:34px}.ac-lang-switch button.active{background:#16243d;color:#fff}@media(max-width:520px){.ac-lang-switch{right:8px;top:8px}.ac-lang-switch button{font-size:10.5px;padding:6px 7px;min-width:30px}}@media print{.ac-lang-switch{display:none!important}}";
    document.head.appendChild(style);
    var box=document.createElement('div');
    box.className='ac-lang-switch';
    box.setAttribute('aria-label','Language');
    Object.keys(LANGS).forEach(function(k){
      var b=document.createElement('button');
      b.type='button';
      b.dataset.lang=k;
      b.textContent=LANGS[k];
      b.onclick=function(){setLang(k)};
      box.appendChild(b);
    });
    document.body.appendChild(box);
  }
  function apply(l){
    running=true;
    document.documentElement.lang=l==='zh'?'zh-Hans':l;
    document.title=l==='th'?title0:trPhrase(title0,l);
    eachText(document.body,function(n){
      if(!originalText.has(n))originalText.set(n,n.nodeValue);
      n.nodeValue=translateText(originalText.get(n),l);
    });
    applyAttrs(document.body,l);
    document.querySelectorAll('.ac-lang-switch button').forEach(function(b){
      b.classList.toggle('active',b.dataset.lang===l);
    });
    running=false;
  }
  function boot(){
    createSwitcher();
    apply(lang());
    var queued=false;
    new MutationObserver(function(){
      if(running||queued)return;
      queued=true;
      setTimeout(function(){queued=false;apply(lang())},30);
    }).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
  window.ACLang={set:setLang,get:lang,apply:apply};
})();
