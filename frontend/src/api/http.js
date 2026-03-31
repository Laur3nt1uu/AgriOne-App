// Legacy compatibility layer - redirects to the main API client with token refresh support
// All new code should import from "./client" directly
import { apiClient } from "./client";
export const http = apiClient;