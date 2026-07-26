---
title: Building with Hugo and Tailwind CSS
date: 2026-07-10
draft: false
description: How this site wires Hugo Extended to Tailwind CSS v4 for a fast, themeable personal site.
tags:
  - hugo
  - tailwind
  - web
author: Gibran Alfaro
---

This site is built with **Hugo Extended** and **Tailwind CSS v4**, using Hugo's native `css.TailwindCSS` pipeline.

## The shape of the stack

- Hugo generates pages from Markdown and Go templates
- Tailwind scans `hugo_stats.json` for class names used in templates
- A small theme script handles **light / dark / system** preferences
- Google Fonts load **Orbitron** for headings and **Noto Sans** for body text

## Theme tokens

Orange is the accent. Dark mode uses a near-black surface with subtle orange grid lines; light mode keeps the same geometry with softer contrast.

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Class-based dark mode means the toggle is explicit, and “system” simply follows `prefers-color-scheme`.

## Why this combo

Hugo ships static HTML at extreme speed. Tailwind keeps styling consistent without a heavyweight theme framework. Together they make a personal site that feels modern and stays easy to maintain.
