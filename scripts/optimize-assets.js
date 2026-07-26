const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function main() {
  const roots = ["predmaint", "docintel", "forecast", "sqlcopilot", "cvinspect"];
  for (const id of roots) {
    const p = path.join("public/assets/projects", id, "architecture-diagram.png");
    if (!fs.existsSync(p)) continue;
    const before = fs.statSync(p).size;
    const buf = await sharp(p)
      .resize({ width: 1600, withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: true })
      .toBuffer();
    fs.writeFileSync(p, buf);
    console.log(id, before, "->", buf.length);
  }

  const svg = [
    "<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'>",
    "<rect width='1200' height='630' fill='#070b12'/>",
    "<rect x='64' y='64' width='1072' height='502' fill='none' stroke='#22d3ee' stroke-opacity='0.35' stroke-width='2'/>",
    "<text x='96' y='220' fill='#f1f5f9' font-size='54' font-family='Georgia, serif'>Mohammad Ahmadian</text>",
    "<text x='96' y='290' fill='#94a3b8' font-size='28' font-family='Arial, sans-serif'>AI / Machine Learning Engineer</text>",
    "<text x='96' y='370' fill='#22d3ee' font-size='22' font-family='Arial, sans-serif'>portfolio.ahmadian.dev</text>",
    "<text x='96' y='480' fill='#64748b' font-size='18' font-family='Arial, sans-serif'>5 Released production-oriented AI systems</text>",
    "</svg>",
  ].join("");

  const og = await sharp(Buffer.from(svg)).png().toBuffer();
  fs.writeFileSync("public/assets/og/og-default.png", og);
  fs.writeFileSync("public/opengraph-image.png", og);

  const iconSvg = [
    "<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'>",
    "<rect width='512' height='512' fill='#070b12'/>",
    "<text x='256' y='310' text-anchor='middle' fill='#22d3ee' font-size='220' font-family='Georgia, serif'>A</text>",
    "</svg>",
  ].join("");
  const icon = await sharp(Buffer.from(iconSvg)).png().toBuffer();
  fs.writeFileSync("public/icon.png", icon);
  fs.writeFileSync("public/apple-touch-icon.png", icon);
  console.log("og/icon updated", og.length, icon.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
