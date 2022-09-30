import type { NotionFilesType } from "./getOriginalNotionProjects";

export function parseNotionFileUrl(file?: NotionFilesType) {
  const firstFile = file?.files[0];
  if (!firstFile) return "";
  return firstFile.external?.url || firstFile.file?.url || "";
}
