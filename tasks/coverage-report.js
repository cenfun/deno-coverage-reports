import MCR from "npm:monocart-coverage-reports@latest";
import { fileURLToPath } from "node:url";

const mcr = MCR({
  //logging: "debug",
  name: "My Deno Coverage Report",
  outputDir: "./coverage-reports/",
  reports: ["v8", "console-details"],
});

const coverageList = [];
const coverageDataDir = "coverage";
for (const dirEntry of Deno.readDirSync(coverageDataDir)) {
  const data = Deno.readTextFileSync(`${coverageDataDir}/${dirEntry.name}`);
  const fileCoverage = JSON.parse(data);
  if (fileCoverage.url.startsWith("file://")) {
    const source = Deno.readTextFileSync(fileURLToPath(fileCoverage.url));
    // NOTE: It requires transpiled source code and sourcemap. Unfortunately, Deno doesn't provide.
    // The source is original code not transpiled code.
    // Because of the offset in coverage is mapping to transpiled code. So, the source is wrong here.
    fileCoverage.source = source;
    coverageList.push(fileCoverage);
  }
}

await mcr.add(coverageList);
await mcr.generate();
