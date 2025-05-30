import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class values into a single className string using clsx and tailwind-merge.
 * This utility helps manage conditional classes and prevents duplicate tailwind classes.
 * 
 * @param {...ClassValue[]} inputs - Any number of class values (strings, objects, arrays, etc.)
 * @returns {string} A merged and deduplicated className string
 * 
 * @example
 * // Returns "btn btn-primary text-white"
 * cn("btn", "btn-primary", "text-white")
 * 
 * // Returns "btn btn-primary" (deduplicates tailwind classes)
 * cn("btn btn-primary", "btn")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
