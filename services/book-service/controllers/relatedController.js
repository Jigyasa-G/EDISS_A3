const axios = require('axios');
const fs    = require('fs');
// const circuitBreaker = require("opossum")
const stateFile  = '/circuit/state.json';   

const TIMEOUT = 3000;   // 3 s  ==> 504 if exceeded
const OPEN_MS = 60000;  // 60 s  ==> 503 while breaker is open

// ─── Circuit‑breaker state helpers ─────────────────────────────────────────
function getState() {
  try { return JSON.parse(fs.readFileSync(stateFile)); }
  catch { return { open: false, openedAt: 0 }; }
}

function setOpen()   { fs.writeFileSync(stateFile, JSON.stringify({ open: true,  openedAt: Date.now() })); }
function setClosed() { fs.writeFileSync(stateFile, JSON.stringify({ open: false, openedAt: 0        })); }

// ─── Controller: GET /books/:isbn/related-books ───────────────────────────
exports.related = async (req, res) => {
  const { isbn } = req.params;
  const state    = getState();

  // Fast‑fail if breaker is open and 60 s window not expired
  if (state.open && Date.now() - state.openedAt < OPEN_MS) {
    return res.sendStatus(503);
  }

  try {
    const recommenderURL = `${process.env.RECOMMENDER_URL}/recommended-titles/isbn/${isbn}`;
    const response = await axios.get(recommenderURL, { timeout: TIMEOUT });

    setClosed();                                   
    // success closes breaker
    const books = response.data;
    if (!books || books.length === 0) return res.sendStatus(204);
    return res.status(200).json(books);

  } catch (err) {
    // timeout → open breaker & send 504, other errors → 503
    setOpen();
    if (err.code === 'ECONNABORTED') return res.sendStatus(504);
    return res.sendStatus(503);
  }
};
