# Local elbow-edge repair — VI and EN

The proximal image cut became visible while the original arm lowered. Rounding the cut left a visible terminal cap at intermediate poses.

The final repair keeps all four original VI/EN desktop/compact Rive files byte-for-byte unchanged, including every keyframe, curve, state machine, image, transform and timing value. The existing `animateScroll` loop passes the same native progress to the Rive player and a small local UV renderer. There is no new autoplay loop, fade, entrance motion, skipped pose or replacement photograph.

Only the upper arm texture band is handled separately during lowering: EN source x64/y0, 416×162; VI source x128/y30, 416×132. The native band is clipped locally, then the same original pixels are mapped onto a quad whose proximal edge moves above the viewport with one shared offset, preserving the edge's angle. The distal edge follows the original native bone/image matrix exactly. At the settled pose this becomes the native quad again; native rendering resumes before the phone enters, without a fade. Original hand, grip, bowl and food pixels and trajectories are unchanged.

VI retains its opaque native background. Only pixels inside the removed quad are repainted from the same original embedded bench texture at its exact original image transform. EN uses its existing separate background. Original VI framing and Cover fit and EN safe FitHeight fit are retained.

The repair canvas is restricted to the proximal region, rather than adding another full viewport canvas. It stops drawing after the lowering segment. Resize and breakpoint reload reset it; reduced-motion mode retains the existing poster behavior. `tools/build-hero-elbow-assets.cjs` extracts the native source bands losslessly and saves their provenance in `assets/hero/us-en/elbow-uv.json`.

Validation: native transforms on VI/EN desktop/compact at eight frames, stationary state, exact reverse-scroll state, end-of-lowering handoff, resize/reset, source asset equality and Rive file byte equality. Independent native-pose reference renders are saved as `elbow-uv-reference.png` and `elbow-uv-reference-vi.png` in `/Users/vunguyen/Desktop/prj-dietfit-review-2026-10-20/`. These are offline artwork checks, not browser screenshots. Browser review is unavailable while local browser use is disabled in Work settings.
