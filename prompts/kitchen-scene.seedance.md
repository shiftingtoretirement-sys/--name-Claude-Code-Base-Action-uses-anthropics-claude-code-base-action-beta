# Kitchen scene — Seedance 2.5 image-to-video prompt

**Goal:** Bring the 1970s-kitchen still to life — the girl actually stirs and
glances at the boy, the boy leans in, steam grows, food sizzles — while keeping
the exact composition, faces, and wardrobe.

**Route:** Image-to-video. The provided still is the conditioning **first
frame**, so identity, set dressing, the "FLOWERS" crock and the painting are
anchored by the image rather than described from scratch. This is the only route
that reliably "preserves original composition and character appearance."

**Settings:** 16:9 · 1080p to lock the look, then 4K · ~6s (start 5–8s).

**Reference to attach:** the kitchen still as the first-frame / conditioning
image (`public/kitchen-scene.jpg`). No other cards needed — there is no
requested on-screen text.

---

## Final prompt (paste as one block; attach the still as the first frame)

```
Image-to-video from the attached still, which is the exact first frame. A single continuous ~6-second photorealistic shot in a warm, nostalgic 1970s family kitchen, observational documentary feel. Preserve the attached frame exactly: same two children, same faces, same hair, same clothing, same green stove, floral wallpaper, wood paneling, framed landscape painting, stainless pot, and the ceramic crock — identities, proportions, and layout do not change. Animate within this frame; do not re-invent it. No cuts, no new characters, no camera whip, no scene change.

GLOBAL LOOK: warm tungsten kitchen light, roughly 3000K, low and soft, raking gently from the left; warm but clearly exposed — both children's faces stay legible, shadows open and lifted, nothing crushed to black. Palette: olive-green stove #7C853C, cream floral wallpaper #E8DCC0 with mustard-and-rust flowers, honey wood paneling #6E4A2A, rust paisley shirt #9C4A38, indigo denim #34506E, warm skin, amber highlights #F2B15C. 35mm lens, shallow depth of field, the two children in focus and the background softly falling off, natural fine film grain, gentle warm nostalgic grade, subtle vignette.

MOTION LAW: one continuous, slow cinematic push-in toward the stove and the two children, carried on a very light handheld float — never locked off, never jittery, no sudden moves. The frame also drifts almost imperceptibly left to right as it pushes in. Natural motion blur throughout. All action is slow, gentle, and unchoreographed, and continues smoothly to the end; in the final second the push-in slows almost to nothing and the shot holds, breathing very slightly, rather than freezing.

ACTION, one continuous take:
- Throughout: the girl on the left holds the wooden spoon and stirs the food in the pan in slow, small circular motions; the spoon stays in her hand and in the pan the whole time. Steam rises continuously from the pan, swirling upward and catching the warm light, becoming gradually more visible. The food sizzles gently. Her hair and the fabric of her shirt shift subtly with her movement. Soft, low-amplitude flicker of warm light from the stove plays across both faces — a gentle glow, never a strobe.
- First third: establishing — she stirs, watching the pan; the boy on the right watches the food; the push-in begins.
- Middle third: she turns her head slightly toward the boy while still stirring, a small natural glance; he leans in a little closer to look down at the food and shifts his weight; steam swells and drifts between them.
- Final third: the push-in eases in closer on the pan and the children; steam curls through the light; motion settles and holds, breathing slightly, to the end.

NEGATIVE PROMPT: extra fingers, sixth finger, fused fingers, missing fingers, malformed hand, extra hand, two wooden spoons, deforming spoon, warping face, morphing face, changing identity, changing hairstyle, changing clothing, swapped clothes, distorted proportions, rubbery limbs, melting, warping walls, warping background, sudden movement, jump cut, fast zoom, snap zoom, jerky motion, teleporting, harsh strobing, new person entering, extra child, garbled text, warped text, morphing letters, new signage, hallucinated labels, added posters, brand logo, watermark, caption, subtitle, timecode, low resolution, blurry, compression artifacts.
```

---

## Shot plan (one continuous take — order is reliable, exact timing is not)

| Phase | ~Time | On screen | Camera |
|---|---|---|---|
| 1 | 0–2s | Girl stirring slow circles; boy watching; steam rising | Push-in begins, light float |
| 2 | 2–4s | Girl glances toward boy (still stirring); boy leans in, shifts weight; steam swells | Push-in continues + faint L→R drift |
| 3 | 4–6s | Closer on pan + kids; steam through light; settle | Push-in eases, holds and "breathes" |

If one generation won't behave, **split on the phase seams** and assemble in an
editor — re-paste GLOBAL LOOK + MOTION LAW into each pass. Because it's
image-to-video, feed the same still as the first frame each time (or the last
good frame of the previous pass) so identity can't drift between segments.

## Iteration variants (change one axis each)

1. **Lower-risk / safest hands:** drop the girl's head-turn and the boy's lean —
   keep only the stirring, steam, flicker, and the push-in. Fewer articulated
   movements = less chance of hand or face warping. Use this if the first pass
   shows any finger or identity drift.
2. **More alive:** add the boy reaching in to point at a piece of food (a slow,
   partially-occluded hand entering and withdrawing), and let the girl smile
   slightly on the glance. More life, but two hands in play — higher hand risk.

## Levers (the fragile bits — watch these first)

- **The stirring hand + wooden spoon** — the single most fragile element. It's
  slow and partly hidden by the pan, which helps. If it garbles, go to variant 1
  or shorten to 5s.
- **Identity/wardrobe drift** — i2v anchors it, but long generations wander;
  keep to ~6s at first, and re-seed from the still on any split pass.
- **Global exposure going too dark** — the warm register pulls toward dusk. The
  prompt states 3000K, raking-left, "warm but clearly exposed, faces legible."
  If it still comes back dim, add `dusk, evening, dim interior, underexposed` to
  the negative prompt.

**Assumptions:** built as a single continuous ~6s observational push-in, warm
nostalgic tungsten, gentle handheld — say the word if you'd rather it be a
locked-off tripod shot, a slower luxury drift, or a full 8s.
