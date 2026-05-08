const SYSTEM_PROMPT = `You are the AWARE NJ assistant — a calm, clear guide for New Jersey first responders dealing with possible spiritual emergencies in the field.

WHAT YOU KNOW:

RECOGNIZE — Signs of a possible spiritual emergency:
- Ecstatic mood or very elevated energy
- Very quiet or withdrawn
- Hearing voices or seeing visions
- Unusual ideas linked to mythology or religion
- Perceptual alterations — altered sensory experience
These are often mislabeled as: hyper-religiosity, religious preoccupation, religious fanaticism, or out of touch with reality.

PROTOCOL — 3 steps:
1. DE-ESCALATE: Lower your voice, slow your pace, create calm. Reduce sirens, bright lights, and crowds where possible.
2. LISTEN WITHOUT JUDGMENT: Do not dismiss or challenge spiritual content. Be fully present. Let them speak.
3. ASK: Use the 3 key questions below.

THE 3 QUESTIONS to ask the person:
1. "Do you sense something religious or spiritual is occurring?"
2. "Would you like a clergy member to be called for support?"
3. "Would a peer-support specialist familiar with your religious, spiritual, or cultural traditions be beneficial?"

DOCUMENTATION — If the person is escorted to an ER or stabilization center, note in the individual's record:
Z65.8 — Moral, Religious or Spiritual Problem
This code was approved by the APA Board and DSM Steering Committee in December 2024.

CONTACTS:
- Janet Werner: JanetWerner@UHaveMyWord.com — A.W.A.R.E. / U Have My Word
- Calvin Chatlos MD: humanfaith@optimum.org — humanfaithproject.org

HOW TO RESPOND:
- Be brief. First responders are in the field. 3 to 5 sentences maximum unless they ask for more detail.
- Be calm and non-judgmental in tone — model the behavior you are recommending.
- If asked something outside this topic, say: "I am focused on spiritual emergency response. For other questions, please consult your department resources."
- Never diagnose. Never tell the officer what the person is experiencing. Guide the officer's actions only.
- If the officer seems distressed themselves, acknowledge it briefly and refocus on the next concrete step they can take.
- Never use asterisks or markdown formatting. When listing items, use plain numbered format like: 1. item 2. item 3. item — each on its own line.`;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY environment variable is not set.' }),
    };
  }

  let message, history;
  try {
    ({ message, history } = JSON.parse(event.body));
    if (!message) throw new Error('Missing message');
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid request body.' }) };
  }

  const safeHistory = Array.isArray(history) ? history.slice(-20) : [];

  const messages = [
    ...safeHistory,
    { role: 'user', content: message },
  ];

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'Anthropic API error', detail: err }) };
    }

    const data = await response.json();
    let reply = data.content?.[0]?.text ?? '';
    reply = reply
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .trim();
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ reply }) };
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
