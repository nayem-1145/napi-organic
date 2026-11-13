# 3D asset notes

## Current state
`src/three/pouch.ts` builds the pouch procedurally and textures it with crops of the supplied
package photo (`public/textures/pouch-front.jpg`, `pouch-back.jpg`). Because those crops come
from a photograph they carry baked lighting and are ~950 × 1640 px. **For a crisp result, replace
them with flat print artwork (the dieline PDF exported to JPG), front and back, 1024 × 1776 px,
sRGB**, with no background — same file names.

## Replacing with a professional GLB
Implement the `PackageModel` interface (pouch.ts) around the loaded model:

| Requirement | Detail |
|---|---|
| Format | glTF 2.0 binary (.glb), Draco or Meshopt compressed, < 1.5 MB |
| Scale / origin | height 2.25 units, origin at the geometric centre, +Y up, front faces +Z |
| Meshes | `Body` and `TearStrip` as separate meshes; tear line ~15.5 % below the top seal on a jagged edge shared by both |
| Strip pivot | empty/bone named `StripHinge` at the left end of the tear line |
| Mouth opening | either a shape key `MouthOpen` (0→1) or a 2-bone rig on the front/back top edges |
| Interior | separate inside surface with a metallised foil material (`Foil`) |
| Materials | PBR metal/rough; outer film roughness ~0.4 with clearcoat; artwork as baseColor (sRGB) |
| Polycount | ≤ 25k triangles total |

Map `setTear` → strip rotation about `StripHinge`, `setOpen` → `MouthOpen` morph influence,
`getMouthLocal` → centre of the tear line. Nothing else in the engine needs to change.
