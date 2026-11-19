/**
 * Napi Organic — website orders → Google Sheet
 *
 * SETUP (one time, ~3 minutes)
 *  1. Open the order sheet → Extensions → Apps Script.
 *  2. Delete everything in Code.gs, paste this whole file, click Save.
 *  3. Deploy → New deployment → gear icon → "Web app".
 *       Execute as:      Me
 *       Who has access:  Anyone
 *     → Deploy → allow the permissions Google asks for.
 *  4. Copy the "Web app URL" (https://script.google.com/macros/s/…/exec)
 *     and paste it into src/config/site.ts → orderForm.sheetUrl.
 *
 * E-mail on every order: see NOTIFY_EMAIL below. After pasting, run "testEmail"
 * once from the editor to allow e-mail sending, then deploy a new version.
 *
 * If you edit this script later: Deploy → Manage deployments → pencil icon →
 * Version: "New version" → Deploy. (The URL stays the same.)
 *
 * The first row of the sheet must contain the column names. Columns are matched
 * by name, so their order does not matter:
 *   Order Status | Customer Name | Phone Number | Selected Package |
 *   Box Quantity | Total Price | Shipping Location | Full Address
 * Optional extra columns that are filled automatically if you add them:
 *   Order ID | Order Date | Total Packets | Product Price | Delivery Charge | Note
 */

/** Tab name. Leave empty to use the first tab of the spreadsheet. */
var SHEET_NAME = '';

var DEFAULT_HEADERS = [
  'Order Status', 'Customer Name', 'Phone Number', 'Selected Package',
  'Box Quantity', 'Total Price', 'Shipping Location', 'Full Address',
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // two orders at the same moment must not overwrite each other
  try {
    var data = JSON.parse(e.postData.contents);

    // basic checks — the website validates too, this stops junk requests
    var phone = String(data['Phone Number'] || '');
    if (!String(data['Customer Name'] || '').trim()) throw new Error('missing name');
    if (!/^01[3-9]\d{8}$/.test(phone)) throw new Error('invalid phone');
    if (!String(data['Full Address'] || '').trim()) throw new Error('missing address');

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
    if (sheet.getLastColumn() === 0) sheet.appendRow(DEFAULT_HEADERS);

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = headers.map(function (h) {
      var key = String(h).trim();
      if (!(key in data)) return '';
      var v = data[key];
      if (key === 'Order Date') return new Date(v);
      if (typeof v === 'number') return v;
      v = String(v).slice(0, 1000);
      // keep leading 0 of phone numbers, and never let user text run as a formula
      if (key === 'Phone Number' || /^[=+\-@]/.test(v)) v = "'" + v;
      return v;
    });
    sheet.appendRow(row);

    // e-mail notification — a mail problem must never fail the order (the row is already saved)
    try {
      sendOrderEmail(data, ss.getUrl());
    } catch (mailErr) {
      console.error('Order e-mail failed: ' + mailErr);
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * E-MAIL NOTIFICATION
 * Who gets the "new order" e-mail. Leave empty to send it to the Google account
 * that owns this script. Several addresses: 'a@gmail.com,b@gmail.com'.
 */
var NOTIFY_EMAIL = '';

function sendOrderEmail(data, sheetUrl) {
  var to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
  if (!to) return;

  var fields = [
    'Order ID', 'Customer Name', 'Phone Number', 'Selected Package', 'Box Quantity',
    'Product Price', 'Delivery Charge', 'Total Price', 'Shipping Location', 'Full Address', 'Note',
  ];
  var rows = fields
    .filter(function (k) { return data[k] !== undefined && data[k] !== ''; })
    .map(function (k) {
      return '<tr><td style="padding:6px 12px;color:#555;white-space:nowrap">' + k +
        '</td><td style="padding:6px 12px;font-weight:600">' + esc(data[k]) + '</td></tr>';
    })
    .join('');

  var tel = String(data['Phone Number'] || '');
  var html =
    '<div style="font-family:Arial,sans-serif;font-size:15px">' +
    '<h2 style="color:#1B4D3E;margin:0 0 12px">নতুন অর্ডার এসেছে 🎉</h2>' +
    '<table style="border-collapse:collapse;background:#f7f5ee">' + rows + '</table>' +
    '<p style="margin-top:16px">' +
    '<a href="tel:' + esc(tel) + '">📞 কল করুন</a> &nbsp;·&nbsp; ' +
    '<a href="https://wa.me/88' + esc(tel) + '">WhatsApp</a> &nbsp;·&nbsp; ' +
    '<a href="' + sheetUrl + '">Google Sheet খুলুন</a></p>' +
    '</div>';

  MailApp.sendEmail({
    to: to,
    subject: 'নতুন অর্ডার — ' + (data['Customer Name'] || '') + ' — ৳' + (data['Total Price'] || ''),
    htmlBody: html,
    name: 'Napi Organic Orders',
  });
}

function esc(v) {
  return String(v).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/**
 * Run this ONCE from the Apps Script editor (select "testEmail" → Run) to give
 * the script permission to send e-mail and to receive a sample notification.
 */
function testEmail() {
  sendOrderEmail({
    'Order ID': 'NAPI-TEST', 'Customer Name': 'Test Customer', 'Phone Number': '01700000000',
    'Selected Package': 'Family Pack (6 packets)', 'Box Quantity': 1, 'Product Price': 580,
    'Delivery Charge': 70, 'Total Price': 650, 'Shipping Location': 'Dhakar Vitore',
    'Full Address': 'Test address',
  }, SpreadsheetApp.getActiveSpreadsheet().getUrl());
}

/** Open the Web app URL in a browser to check that the deployment works. */
function doGet() {
  return json({ ok: true, message: 'Napi Organic order endpoint is running.' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
