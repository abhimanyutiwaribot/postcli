import type { Method } from "../types/request.js";
import type { LeftSection } from "../types/ui.js";

export const METHODS: Method[] = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];
export const LEFT_SECTIONS: LeftSection[] = ["url-method", "params", "req-headers", "body", "auth"];
export const VIEWPORT_HEIGHT = 18; // lines visible in response viewport
export const DIVIDER = "─".repeat(54);
export const RIGHT_DIVIDER = "─".repeat(56);