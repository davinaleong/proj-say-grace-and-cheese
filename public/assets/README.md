# Photographer Assets

This directory contains assets organized by photographer name.

## Directory Structure

```
assets/
├── john-smith/
│   ├── portrait1.jpg
│   ├── portrait2.jpg
│   └── profile.jpg
├── sarah-oconnor/
│   ├── wedding1.jpg
│   ├── wedding2.jpg
│   └── profile.jpg
└── marie-claire-dubois/
    ├── landscape1.jpg
    ├── landscape2.jpg
    └── profile.jpg
```

## Usage

The photographer mapper utility automatically converts photographer names to their corresponding asset directory paths:

- "John Smith" → `/assets/john-smith/`
- "Sarah O'Connor" → `/assets/sarah-oconnor/`
- "Marie-Claire Dubois" → `/assets/marie-claire-dubois/`