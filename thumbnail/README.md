# YouTube thumbnail — "RETIRE TO WHAT?"

`retire-to-what.png` — 1280×720 (16:9). Deep charcoal→black gradient, heavy
Anton headline in the left ~50% ("RETIRE / TO" white, "WHAT?" larger in golden
`#FBBF24`), and clean vignetted negative space on the right for a person cutout
to be composited later. No borders, stripes, or logos.

`retire-to-what.html` is the self-contained source (the Anton subset font is
embedded as a data URI, so it renders offline with no network).

## Re-render

Any headless Chromium works. Example with a headless-shell binary:

```bash
chrome-headless-shell --headless --no-sandbox --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1280,720 \
  --virtual-time-budget=3000 --run-all-compositor-stages-before-draw \
  --screenshot=retire-to-what.png "file://$PWD/retire-to-what.html"
```

To tweak wording, colors, or sizing, edit the `.l1/.l2/.l3` rules and the
gradient in `retire-to-what.html`, then re-render.
