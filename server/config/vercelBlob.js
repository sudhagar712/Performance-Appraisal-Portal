
export const uploadToVercelBlob = async (fileBuffer, filename) => {
  try {
    const blobModule = await import("@vercel/blob");
    const blob = await blobModule.put(filename, fileBuffer, {
      access: "public",
      addRandomSuffix: true,
    });
    return blob.url;
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND" || error.message?.includes("Cannot find module")) {
      console.warn("Vercel Blob package not installed. For local dev, this is OK.");
      throw new Error("Vercel Blob package not available - install with: npm install @vercel/blob");
    }
    console.error("Error uploading to Vercel Blob:", error);
    throw error;
  }
};

// Delete file from Vercel Blob Storage
export const deleteFromVercelBlob = async (url) => {
  try {
    if (!url || !url.includes("blob.vercel-storage.com")) {
      return;
    }
    const blobModule = await import("@vercel/blob");
    await blobModule.del(url);
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND" || error.message?.includes("Cannot find module")) {
     
      return;
    }
    console.error("Error deleting from Vercel Blob:", error);
  }
};

