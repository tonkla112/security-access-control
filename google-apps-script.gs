/**
 * Security Access Control - Google Sheets Webhook  (v4)
 * ★ ตรงกับที่ deploy จริงใน Apps Script project (03/07/2026)
 * - doPost: log entry/exit -> 'AccessLog' (+ รูปถ่าย 3 ช่อง -> Google Drive, ลิงก์ลงคอลัมน์ 10-12)
 * - doGet ?action=register : register contractor -> 'Contractors', returns cardNo
 * - doGet ?action=list     : list contractors as JSON
 * - doGet ?action=update   : update validTo of a card
 * - doGet ?action=stats    : dashboard stats
 *
 * Webhook URL:
 * https://script.google.com/macros/s/AKfycbxGnSfkPWzMLWEcrF0hRjHiQ3AImrDDCp4W6Jqsi4gO3hV1NqRrAzcen0f6Tj9UOJx_/exec
 * Spreadsheet:
 * https://docs.google.com/spreadsheets/d/183dVsY52BAhfLl-m2_9glRN1h9YM7BAmT30-ke4X5p8/edit
 */
var SHEET_NAME = 'AccessLog';
var REG_SHEET  = 'Contractors';

function getSpreadsheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (e) {}
  }
  var ss = SpreadsheetApp.create('Access Control Log');
  props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

function getRegSheet_(ss) {
  var sh = ss.getSheetByName(REG_SHEET);
  if (!sh) sh = ss.insertSheet(REG_SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['รหัสบัตร','วันที่ลงทะเบียน','บริษัท','ชื่อ-สกุล','บัตร ปชช. (4 ตัวท้าย)','เบอร์โทร','ประเภทงาน','เริ่ม','หมดอายุ','ผู้ติดต่อภายใน','แผนก','ลงทะเบียนผ่าน']);
    sh.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#16243d').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
  return sh;
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === 'list') return listContractors_();
  if (p.action === 'register') return registerContractor_(p);
  if (p.action === 'update') return updateContractor_(p);
  if (p.action === 'stats') return stats_();
  if (p.action === 'report') return report_(p);
  var ss = getSpreadsheet_();
  return ContentService.createTextOutput('Access Control webhook is running. Sheet: ' + ss.getUrl());
}

function registerContractor_(p) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (!p.company || !p.name) return json_({ status: 'error', message: 'missing company/name' });
    var ss = getSpreadsheet_();
    var sh = getRegSheet_(ss);
    var cardNo = 'CTR-' + ('000' + sh.getLastRow()).slice(-3);
    sh.appendRow([cardNo, new Date(), p.company || '', p.name || '', "'" + (p.id4 || ''), "'" + (p.phone || ''), p.workType || '', p.validFrom || '', p.validTo || '', p.contact || '', p.dept || '', p.via || 'office']);
    return json_({ status: 'ok', cardNo: cardNo });
  } catch (err) {
    return json_({ status: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function updateContractor_(p) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (!p.cardNo || !p.validTo) return json_({ status: 'error', message: 'missing cardNo/validTo' });
    var ss = getSpreadsheet_();
    var sh = ss.getSheetByName(REG_SHEET);
    if (!sh || sh.getLastRow() < 2) return json_({ status: 'error', message: 'no contractors' });
    var vals = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (String(vals[i][0]).toUpperCase() === String(p.cardNo).toUpperCase()) {
        sh.getRange(i + 2, 9).setValue(p.validTo);
        return json_({ status: 'ok', cardNo: String(vals[i][0]), validTo: p.validTo });
      }
    }
    return json_({ status: 'error', message: 'cardNo not found' });
  } catch (err) {
    return json_({ status: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function listContractors_() {
  try {
    var ss = getSpreadsheet_();
    var sh = ss.getSheetByName(REG_SHEET);
    var out = [];
    if (sh && sh.getLastRow() > 1) {
      var vals = sh.getRange(2, 1, sh.getLastRow() - 1, 12).getValues();
      for (var i = 0; i < vals.length; i++) {
        var r = vals[i];
        out.push({ cardNo: String(r[0]), company: String(r[2]), name: String(r[3]), phone: String(r[5]), workType: String(r[6]), validFrom: fmt_(r[7]), validTo: fmt_(r[8]), contact: String(r[9]), dept: String(r[10]) });
      }
    }
    return json_({ status: 'ok', contractors: out });
  } catch (err) {
    return json_({ status: 'error', message: String(err) });
  }
}

function stats_() {
  try {
    var tz = 'Asia/Bangkok';
    var ss = getSpreadsheet_();
    var out = { status: 'ok', todayIn: 0, todayOut: 0, onsite: [], feed: [], cards: { active: 0, total: 0, expiring: 0 } };
    var log = ss.getSheetByName(SHEET_NAME);
    if (log && log.getLastRow() > 1) {
      var today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
      var n = log.getLastRow() - 1;
      var take = Math.min(n, 400);
      var rng = log.getRange(log.getLastRow() - take + 1, 1, take, 13);
      var vals = rng.getValues();
      var disp = rng.getDisplayValues();
      var onsiteMap = {};
      var hourly = {};
      for (var i = 0; i < vals.length; i++) {
        var r = vals[i];
        var d = r[0] instanceof Date ? Utilities.formatDate(r[0], tz, 'yyyy-MM-dd') : String(r[0]).slice(0, 10);
        var isIn = String(r[2]) === 'เข้า';
        var key = String(r[3]) + '|' + String(r[5]);
        if (d === today) {
          if (isIn) out.todayIn++; else out.todayOut++;
          var hh = String(disp[i][1]).slice(0, 2);
          if (/^\d\d$/.test(hh)) hourly[hh] = (hourly[hh] || 0) + 1;
        }
        if (isIn) onsiteMap[key] = { company: String(r[3]), companyZh: String(r[4]), plate: String(r[5]), time: disp[i][1] };
        else delete onsiteMap[key];
      }
      var keys = Object.keys(onsiteMap);
      for (var k = keys.length - 1; k >= 0; k--) out.onsite.push(onsiteMap[keys[k]]);
      var fi = [];
      for (var q = vals.length - 1; q >= 0 && fi.length < 10; q--) {
        fi.push({ time: disp[q][1], company: String(vals[q][3]), companyZh: String(vals[q][4]), type: String(vals[q][2]) === 'เข้า' ? 'in' : 'out', plate: String(vals[q][5]), gate: Number(vals[q][8]) || 1, guard: String(vals[q][12] || '') });
      }
      out.feed = fi;
      out.hourly = hourly;
    }
    var reg = ss.getSheetByName(REG_SHEET);
    if (reg && reg.getLastRow() > 1) {
      var rv = reg.getRange(2, 1, reg.getLastRow() - 1, 12).getValues();
      var now = new Date(); now.setHours(0, 0, 0, 0);
      var soon = new Date(now.getTime() + 30 * 86400000);
      out.cards.total = rv.length;
      for (var j = 0; j < rv.length; j++) {
        var vt = rv[j][8];
        var dt = vt instanceof Date ? vt : new Date(String(vt));
        if (!isNaN(dt.getTime()) && dt >= now) {
          out.cards.active++;
          if (dt <= soon) out.cards.expiring++;
        }
      }
    }
    return json_(out);
  } catch (err) {
    return json_({ status: 'error', message: String(err) });
  }
}

/**
 * Monthly report for HR/Safety
 * ?action=report&month=YYYY-MM  (default: current month, Asia/Bangkok)
 */
function report_(p) {
  try {
    var tz = 'Asia/Bangkok';
    var month = p.month || Utilities.formatDate(new Date(), tz, 'yyyy-MM');
    var ss = getSpreadsheet_();
    var out = {
      status: 'ok', month: month,
      totalIn: 0, totalOut: 0, peopleIn: 0,
      daily: {}, companies: {}, hours: {}, gates: {},
      photo: { full: 0, partial: 0, none: 0 },
      stuck: [],
      cards: { total: 0, active: 0, expired: 0, expiring: [] }
    };
    var log = ss.getSheetByName(SHEET_NAME);
    if (log && log.getLastRow() > 1) {
      var n = log.getLastRow() - 1;
      var rng = log.getRange(2, 1, n, 12);
      var vals = rng.getValues();
      var disp = rng.getDisplayValues();
      var open = {};
      for (var i = 0; i < n; i++) {
        var r = vals[i];
        var d = r[0] instanceof Date ? Utilities.formatDate(r[0], tz, 'yyyy-MM-dd') : String(r[0]).slice(0, 10);
        if (d.slice(0, 7) !== month) continue;
        var isIn = String(r[2]) === 'เข้า';
        var day = d.slice(8, 10);
        if (!out.daily[day]) out.daily[day] = { in: 0, out: 0 };
        var comp = String(r[3]) || '—';
        if (!out.companies[comp]) out.companies[comp] = { in: 0, out: 0, people: 0, recs: 0, withPhoto: 0 };
        var c = out.companies[comp];
        var ppl = Number(r[6]) || 0;
        if (isIn) { out.daily[day].in++; out.totalIn++; c.in++; c.people += ppl; out.peopleIn += ppl; }
        else { out.daily[day].out++; out.totalOut++; c.out++; }
        var g = String(r[8] || '1');
        out.gates[g] = (out.gates[g] || 0) + 1;
        var hm = String(disp[i][1] || '').match(/(\d{1,2})[:.](\d{2})/);
        if (hm) { var hh = ('0' + hm[1]).slice(-2); out.hours[hh] = (out.hours[hh] || 0) + 1; }
        var pc = (r[9] ? 1 : 0) + (r[10] ? 1 : 0) + (r[11] ? 1 : 0);
        c.recs++;
        if (pc >= 3) out.photo.full++;
        else if (pc > 0) out.photo.partial++;
        else out.photo.none++;
        if (pc > 0) c.withPhoto++;
        var key = comp + '|' + String(r[5]);
        if (isIn) open[key] = { date: d, time: String(disp[i][1] || ''), company: comp, plate: String(r[5]), people: ppl };
        else delete open[key];
      }
      var ks = Object.keys(open);
      for (var k = 0; k < ks.length; k++) out.stuck.push(open[ks[k]]);
    }
    var reg = ss.getSheetByName(REG_SHEET);
    if (reg && reg.getLastRow() > 1) {
      var rv = reg.getRange(2, 1, reg.getLastRow() - 1, 12).getValues();
      var now = new Date(); now.setHours(0, 0, 0, 0);
      var soon = new Date(now.getTime() + 30 * 86400000);
      out.cards.total = rv.length;
      for (var j = 0; j < rv.length; j++) {
        var vt = rv[j][8];
        var dt = vt instanceof Date ? vt : new Date(String(vt));
        if (!isNaN(dt.getTime()) && dt >= now) {
          out.cards.active++;
          if (dt <= soon) out.cards.expiring.push({ cardNo: String(rv[j][0]), name: String(rv[j][3]), company: String(rv[j][2]), validTo: fmt_(vt) });
        } else {
          out.cards.expired++;
        }
      }
    }
    return json_(out);
  } catch (err) {
    return json_({ status: 'error', message: String(err) });
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = getSpreadsheet_();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['วันที่-เวลา (บันทึก)','เวลา (หน้างาน)','ประเภท','บริษัท','บริษัท (จีน)','ทะเบียนรถ','จำนวนคน','ผู้ติดต่อ','ประตู','รูปรถ','รูปบุคคล','รูปสิ่งของ','ยาม']);
      sheet.getRange(1, 1, 1, 13).setFontWeight('bold').setBackground('#16243d').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
    // ชีทเดิม 9 คอลัมน์ -> เติมหัวคอลัมน์รูป 10-12
    if (!sheet.getRange(1, 10).getValue()) {
      sheet.getRange(1, 10, 1, 3).setValues([['รูปรถ','รูปบุคคล','รูปสิ่งของ']]).setFontWeight('bold').setBackground('#16243d').setFontColor('#ffffff');
    }
    // ชีทเดิม 12 คอลัมน์ -> เติมหัวคอลัมน์ยาม (13)
    if (!sheet.getRange(1, 13).getValue()) {
      sheet.getRange(1, 13).setValue('ยาม').setFontWeight('bold').setBackground('#16243d').setFontColor('#ffffff');
    }
    var links = savePhotos_(data);
    sheet.appendRow([
      data.savedAt ? new Date(data.savedAt) : new Date(),
      data.time || '',
      data.type === 'in' ? 'เข้า' : 'ออก',
      data.company || '',
      data.companyZh || '',
      data.plate || '',
      data.people || '',
      data.contact || '',
      data.gate || '',
      links.vehicle || '',
      links.person || '',
      links.goods || '',
      data.guard || ''
    ]);
    return json_({ status: 'ok', photos: links });
  } catch (err) {
    return json_({ status: 'error', message: String(err) });
  }
}

function savePhotos_(data) {
  var out = {};
  var ph = data.photos;
  if (!ph) return out;
  var folder = null;
  var stamp = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyyMMdd-HHmmss');
  var keys = ['vehicle', 'person', 'goods'];
  var names = { vehicle: 'car', person: 'person', goods: 'goods' };
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var v = ph[k];
    if (!v) continue;
    try {
      if (!folder) folder = getPhotoFolder_();
      var s = String(v);
      var b64 = s.indexOf(',') > -1 ? s.split(',')[1] : s;
      var fname = stamp + '_' + (data.type === 'in' ? 'IN' : 'OUT') + (data.plate ? '_' + data.plate : '') + '_' + names[k] + '.jpg';
      var blob = Utilities.newBlob(Utilities.base64Decode(b64), 'image/jpeg', fname);
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      out[k] = file.getUrl();
    } catch (err) {}
  }
  return out;
}

function getPhotoFolder_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('PHOTO_FOLDER_ID');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (e) {}
  }
  var f = DriveApp.createFolder('Access Control Photos');
  props.setProperty('PHOTO_FOLDER_ID', f.getId());
  return f;
}

function fmt_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, 'Asia/Bangkok', 'yyyy-MM-dd');
  return String(v || '');
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}


/* ═══════════ Daily Email Alert (v7) ═══════════
 * sendDailyAlert : ส่งเมลแจ้งเตือน HR — บัตรใกล้หมดอายุ ≤7 วัน + รถค้างในพื้นที่ข้ามคืน
 * setupDailyAlert: รันครั้งเดียวเพื่อตั้ง trigger ทุกวัน 07:00 (ลบ trigger เก่าก่อน)
 * ผู้รับ: Script Property "ALERT_EMAIL" (คั่นหลายคนด้วย ,) — ถ้าไม่ตั้ง ส่งหาเจ้าของสคริปต์
 */
function setupDailyAlert() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'sendDailyAlert') ScriptApp.deleteTrigger(triggers[i]);
  }
  ScriptApp.newTrigger('sendDailyAlert').timeBased().everyDays(1).atHour(7).create();
  return 'OK: trigger ตั้งแล้ว ทุกวัน ~07:00';
}

function sendDailyAlert() {
  var tz = 'Asia/Bangkok';
  var ss = getSpreadsheet_();
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var todayStr = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');

  // ── 1) บัตรใกล้หมดอายุ ≤7 วัน ──
  var expiring = [];
  var reg = ss.getSheetByName(REG_SHEET);
  if (reg && reg.getLastRow() > 1) {
    var rv = reg.getRange(2, 1, reg.getLastRow() - 1, 12).getValues();
    var soon = new Date(today.getTime() + 7 * 86400000);
    for (var j = 0; j < rv.length; j++) {
      var vt = rv[j][8];
      var dt = vt instanceof Date ? vt : new Date(String(vt));
      if (!isNaN(dt.getTime()) && dt >= today && dt <= soon) {
        expiring.push({
          cardNo: String(rv[j][0]), company: String(rv[j][2]), name: String(rv[j][3]),
          validTo: Utilities.formatDate(dt, tz, 'dd/MM/yyyy'),
          days: Math.round((dt.getTime() - today.getTime()) / 86400000)
        });
      }
    }
    expiring.sort(function(a, b) { return a.days - b.days; });
  }

  // ── 2) รถค้างในพื้นที่ข้ามคืน (เข้าก่อนวันนี้ ยังไม่มีออก) ──
  var stuck = [];
  var log = ss.getSheetByName(SHEET_NAME);
  if (log && log.getLastRow() > 1) {
    var n = log.getLastRow() - 1;
    var take = Math.min(n, 400);
    var rng = log.getRange(log.getLastRow() - take + 1, 1, take, 13);
    var vals = rng.getValues();
    var disp = rng.getDisplayValues();
    var onsiteMap = {};
    for (var i = 0; i < vals.length; i++) {
      var r = vals[i];
      var d = r[0] instanceof Date ? Utilities.formatDate(r[0], tz, 'yyyy-MM-dd') : String(r[0]).slice(0, 10);
      var isIn = String(r[2]) === 'เข้า';
      var key = String(r[3]) + '|' + String(r[5]);
      if (isIn) onsiteMap[key] = { company: String(r[3]), plate: String(r[5]), date: d, time: disp[i][1], guard: String(r[12] || '') };
      else delete onsiteMap[key];
    }
    var keys = Object.keys(onsiteMap);
    for (var k = 0; k < keys.length; k++) {
      var o = onsiteMap[keys[k]];
      if (o.date < todayStr) stuck.push(o);
    }
  }

  if (expiring.length === 0 && stuck.length === 0) return 'ไม่มีเรื่องต้องแจ้ง — ไม่ส่งเมล';

  // ── 3) ประกอบอีเมล ──
  var recipient = '';
  try { recipient = PropertiesService.getScriptProperties().getProperty('ALERT_EMAIL') || ''; } catch (e) {}
  if (!recipient) recipient = Session.getEffectiveUser().getEmail();

  var subject = '[Access Control] แจ้งเตือนประจำวัน ' + Utilities.formatDate(new Date(), tz, 'dd/MM/yyyy')
    + ' — บัตรใกล้หมดอายุ ' + expiring.length + ' ใบ · ค้างในพื้นที่ ' + stuck.length + ' รายการ';

  var html = '<div style="font-family:sans-serif;max-width:640px;">'
    + '<h2 style="color:#16243d;">แจ้งเตือนระบบควบคุมการเข้า-ออก</h2>';

  if (stuck.length) {
    html += '<h3 style="color:#b3261e;">🚨 ค้างในพื้นที่ข้ามคืน (' + stuck.length + ' รายการ)</h3>'
      + '<table border="1" cellpadding="6" style="border-collapse:collapse;font-size:13px;">'
      + '<tr style="background:#16243d;color:#fff;"><th>บริษัท</th><th>ทะเบียน</th><th>เข้าเมื่อ</th><th>ยามผู้บันทึก</th></tr>';
    stuck.forEach(function(o) {
      html += '<tr><td>' + o.company + '</td><td>' + o.plate + '</td><td>' + o.date + ' ' + o.time + '</td><td>' + (o.guard || '—') + '</td></tr>';
    });
    html += '</table><p style="font-size:12px;color:#666;">โปรดตรวจสอบว่าออกจริงแต่ไม่ได้สแกน หรือยังอยู่ในพื้นที่</p>';
  }

  if (expiring.length) {
    html += '<h3 style="color:#a05a00;">⏳ บัตรใกล้หมดอายุภายใน 7 วัน (' + expiring.length + ' ใบ)</h3>'
      + '<table border="1" cellpadding="6" style="border-collapse:collapse;font-size:13px;">'
      + '<tr style="background:#16243d;color:#fff;"><th>บัตร</th><th>บริษัท</th><th>ชื่อ</th><th>หมดอายุ</th><th>เหลือ (วัน)</th></tr>';
    expiring.forEach(function(c) {
      html += '<tr><td>' + c.cardNo + '</td><td>' + c.company + '</td><td>' + c.name + '</td><td>' + c.validTo + '</td><td style="text-align:center;">' + c.days + '</td></tr>';
    });
    html += '</table><p style="font-size:12px;color:#666;">ต่ออายุ/ระงับบัตรได้ที่หน้า <a href="https://tonkla112.github.io/security-access-control/settings.html">ตั้งค่า · จัดการบัตร</a></p>';
  }

  html += '<p style="font-size:12px;color:#999;">Dashboard: <a href="https://tonkla112.github.io/security-access-control/dashboard.html">เปิดศูนย์ควบคุม</a> · อีเมลอัตโนมัติจาก Apps Script (แก้ผู้รับ: Script Property ALERT_EMAIL)</p></div>';

  MailApp.sendEmail({ to: recipient, subject: subject, htmlBody: html });
  return 'ส่งแล้ว -> ' + recipient + ' (expiring=' + expiring.length + ', stuck=' + stuck.length + ')';
}
