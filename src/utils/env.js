// Expose environment variables to window for debugging
export function setupEnvVariables() {
  if (typeof window !== 'undefined') {
    window.env = {
      VITE_GOOGLE_DRIVE_FOLDER_ID: import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID,
      // Add other variables as needed
    };
  }
}
