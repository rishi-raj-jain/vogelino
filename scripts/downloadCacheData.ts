import * as dotenv from "dotenv";
dotenv.config();
import { notion } from "./lib/notion";
import { createDirectoriesIfNotAlreadyThere } from "./lib/createDirectoriesIfNotAlreadyThere";
import { getOriginalNotionProjects } from "./lib/getOriginalNotionProjects";
import { getOriginalNotionInspirations } from "./lib/getOriginalNotionInspirations";
import { getOriginalNotionCollaborators } from "./lib/getOriginalNotionCollaborators";
import { parseOriginalNotionProjects } from "./lib/parseOriginalNotionProjects";
import { parseOriginalNotionInspirations } from "./lib/parseOriginalNotionInspirations";
import {
  INSPIRATIONS_JSON_PATH,
  PROJECTS_JSON_PATH,
  ORIGINAL_PROJECTS_JSON_PATH,
  ORIGINAL_COLLABORATORS_JSON_PATH,
  ORIGINAL_INSPIRATIONS_JSON_PATH,
  ORIGINAL_ABOUT_BLOCKS_JSON_PATH,
} from "./paths";
import { writeJsonFile } from "./lib/writeJsonFile";
import { logEnd, logH1, logIndented, logSecondary } from "./lib/logUtil";
import { getOriginalNotionPageBlocks } from "./lib/getOriginalNotionPageBlocks";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const projectsDatabaseId = process.env.NOTION_PORTFOLIO_DATABASE_ID || "";
const inspirationsDatabaseId = process.env.NOTION_INSPIRATION_DATABASE_ID || "";
const collaboratorsDatabaseId =
  process.env.NOTION_COLLABORATORS_DATABASE_ID || "";
const aboutPageId = process.env.NOTION_ABOUT_PAGE_ID || "";

async function downloadCacheData() {
  logH1(`Downloading original data from Notion`);
  logIndented(`🗂 Projects`);
  logIndented(`🗯 Inspirations`);
  logIndented(`😎 Collaborators`);
  logIndented(`ℹ️ CAbout Blocks`);
  const [
    originalProjects,
    originalInspirations,
    originalCollaborators,
    originalAboutPageBlocks,
  ] = await Promise.all([
    getOriginalNotionProjects(projectsDatabaseId, notion),
    getOriginalNotionInspirations(inspirationsDatabaseId, notion),
    getOriginalNotionCollaborators(collaboratorsDatabaseId, notion),
    getOriginalNotionPageBlocks(aboutPageId, notion),
  ]);
  logIndented(`✅ Original data fetching success`);
  logSecondary([`💾 Saving originals`]);

  await createDirectoriesIfNotAlreadyThere("data");
  await Promise.all([
    writeJsonFile(ORIGINAL_PROJECTS_JSON_PATH, originalProjects),
    writeJsonFile(ORIGINAL_COLLABORATORS_JSON_PATH, originalCollaborators),
    writeJsonFile(ORIGINAL_INSPIRATIONS_JSON_PATH, originalInspirations),
    writeJsonFile<BlockObjectResponse[]>(
      ORIGINAL_ABOUT_BLOCKS_JSON_PATH,
      originalAboutPageBlocks
    ),
  ]);
  logIndented(`🛟 Saved ✔️`);
  logIndented(ORIGINAL_PROJECTS_JSON_PATH, 1);
  logIndented(ORIGINAL_COLLABORATORS_JSON_PATH, 1);
  logIndented(ORIGINAL_INSPIRATIONS_JSON_PATH, 1);

  logSecondary([`🧹 Parsing originals`]);
  const [projects, inspirations] = await Promise.all([
    parseOriginalNotionProjects(originalProjects, originalCollaborators),
    parseOriginalNotionInspirations(originalInspirations),
  ]);
  logIndented(`✅ Parsed data fetching success`);

  logSecondary([`💾 Saving parsed content`]);
  logIndented(`🗂 ${projects.length} projects`);
  logIndented(`🗯 ${inspirations.length} inspirations`);
  await Promise.all([
    writeJsonFile(PROJECTS_JSON_PATH, projects),
    writeJsonFile(INSPIRATIONS_JSON_PATH, inspirations),
  ]);
  logIndented(`🛟 Saved ✔️`);
  logIndented(PROJECTS_JSON_PATH, 1);
  logIndented(INSPIRATIONS_JSON_PATH, 1);

  logEnd();
  process.exit();
}

void downloadCacheData();
