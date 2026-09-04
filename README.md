# WHOLEGACY Next.js Homepage

Premium Coming Soon landing page based on the WHOLEGACY visual concept.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Deploy

Push this repository to GitHub and import it into Vercel.

## Custom domain

After deployment, add `wholegacy.com` in Vercel > Project > Settings > Domains.
Then configure the DNS records shown by Vercel in your Hostinger DNS panel.

## Note

The email forms are visual placeholders in this first version. Connect them to a mailing service or backend before launch.


## WHOLEGACY P2P Webchat

The `/webchat` route provides a temporary browser-to-browser chat using WebRTC via PeerJS. The room creator generates a room ID, password and invite link. Chat content is sent over the P2P data channel and is not persisted by the WHOLEGACY application. For production, consider self-hosting the PeerJS signaling server.
