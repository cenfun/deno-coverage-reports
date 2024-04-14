import MCR from "npm:monocart-coverage-reports";
import { fileURLToPath } from "node:url";

const mcr = MCR({
  name: "My Deno Coverage Report",
  outputDir: "./coverage-reports/",
  logging: "debug",
});

const coverageList = [];
const coverageDataDir = "coverage";
for (const dirEntry of Deno.readDirSync(coverageDataDir)) {
  const data = Deno.readTextFileSync(`${coverageDataDir}/${dirEntry.name}`);
  const fileCoverage = JSON.parse(data);
  if (fileCoverage.url.startsWith("file://")) {
    const source = Deno.readTextFileSync(fileURLToPath(fileCoverage.url));
    // NOTE:
    // The source is original code not compiled code.
    // Because of the offset in coverage is mapping to compiled code. So, the source is wrong here.
    // It requires compiled source code and sourcemap. Unfortunately, Deno doesn't provide.
    fileCoverage.source = source;
    coverageList.push(fileCoverage);
  }
}

await mcr.add(coverageList);
await mcr.generate();
