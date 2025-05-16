export function generateUniqueId(prefix = "expense"): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
}
