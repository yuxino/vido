# Vido README logo

`vido-avatar.png` is a 1254 × 1254 RGBA portrait. The circular edge is antialiased and every pixel outside the circle is fully transparent. The original white background remains inside the circle; this is not a cutout of individual hair strands.

The logo derives from Vido's approved round-faced chibi artwork, originally made with OpenAI image generation. Its source RGB master is preserved in the website repository at `docs/brand/vido-portrait-chibi-source.png` (SHA-256 `2710389b3748c48ddf3b1bf5082e0db34e404e26e496d2eb0c9457a2fdd1faff`).

The authorized local export scales the complete 1254 × 1254 source down to 1154 × 1154 with Lanczos, places it at (50, 42) on a 1254 × 1254 white canvas, then applies a circle centered at (627, 627) with radius 603. The one-pixel antialiasing ramp stays inside the circle. There is no upscaling, recoloring, redrawing or white-threshold background removal.

The README PNG matches the website's downloadable logo byte for byte: SHA-256 `6e290d0eb7e59b33022c71339607d550c372138206410ddd5511d78636fb3ead`. The website's hero portrait remains unchanged.
