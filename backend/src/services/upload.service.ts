/**
 * S3 / Cloudinary image upload service.
 * Placeholder — wire S3/Cloudinary SDK here.
 */
export async function uploadImage(base64OrUrl: string, folder = "issues"): Promise<string> {
  return typeof base64OrUrl === "string" && base64OrUrl.startsWith("http") ? base64OrUrl : "https://example.com/placeholder.png";
}