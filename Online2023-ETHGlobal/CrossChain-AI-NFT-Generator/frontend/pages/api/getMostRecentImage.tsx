import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const imageDirectoryPath = "./userImage/";
  const mostRecentImage = getMostRecentImage(imageDirectoryPath);

  res.status(200).json({ mostRecentImage });
};

function getMostRecentImage(directoryPath: string) {
  const files = fs.readdirSync(directoryPath);

  let mostRecentFileName = null;
  let mostRecentFileDate = 0;

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const fileStats = fs.statSync(filePath);

    if (fileStats.isFile() && fileStats.mtimeMs > mostRecentFileDate) {
      mostRecentFileName = file; // Store just the file name
      mostRecentFileDate = fileStats.mtimeMs;
    }
  }

  return mostRecentFileName;
}
