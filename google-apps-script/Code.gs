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

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

/** Open the Web app URL in a browser to check that the deployment works. */
function doGet() {
  return json({ ok: true, message: 'Napi Organic order endpoint is running.' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
