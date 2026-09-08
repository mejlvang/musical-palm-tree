---
name: omarchy-art
description: Generate an Omarchy-style ASCII wordmark made from square block characters when the user invokes /omarchy-art followed by a word or short phrase.
---

# Omarchy Art

## When to use

Use this skill when the user explicitly invokes `/omarchy-art` and provides a word to render,
for example `/omarchy-art design`.

## Instructions

1. Treat all text after `/omarchy-art` as the input. If no input is provided, ask the user which
   word to render.
2. Convert lowercase letters to uppercase, but preserve the spelling and order exactly.
3. Render each A-Z letter using the fixed 5-by-7 bitmap in [block-font.md](./block-font.md).
   Never invent letter shapes. In each bitmap, replace `1` with `██` and `0` with two spaces.
4. Join corresponding rows of adjacent letters with two spaces. Keep every row the same width
   and do not wrap the word.
5. Use only the block glyph `█` and spaces for the letter shapes. This makes the result stable
   and readable in a monospaced terminal while retaining the dense geometric feel of the
   Omarchy logo.
6. For spaces, punctuation, or digits, preserve the character as a separate plain-text token
   with a sensible fixed-width gap. Do not silently remove input.
7. Return only the rendered wordmark in a fenced `text` code block. Do not include an
   explanation, heading, or commentary.

## Example

Input:

```text
/omarchy-art design
```

Output requirements:

- The visible word must read `DESIGN`.
- Every letter should use the same seven-row height and visual weight.
- The result must remain aligned when viewed in a monospaced font.