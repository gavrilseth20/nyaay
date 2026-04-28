import { getStorageBucket } from "../firebase.js";

export async function uploadBuffer({ buffer, destination, contentType }) {
  const bucket = getStorageBucket();
  const file = bucket.file(destination);
  await file.save(buffer, { metadata: { contentType } });
  return `gs://${bucket.name}/${destination}`;
}
