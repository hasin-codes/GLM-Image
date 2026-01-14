<div align="center">
  <img src="public/Logo.svg" alt="GLM-Image Logo" width="120" />
</div>

# GLM-Image

GLM-Image is a dedicated web interface for the latest image generation model by Z.ai.

While the GLM-Image model is accessible via Hugging Face, this project provides a robust, production-grade environment for users to interact with the model. It extends the core generation capabilities with multi-layer rendering support, a refined user interface, and advanced layout controls that are not available in standard demo environments.

## Overview

This application bridges the gap between raw model inference and a usable creative workflow. It is built to handle complex generation tasks including layer separation and high-fidelity inspections.

**Current Status**: Frontend implementation is complete. Backend integration with the GLM-4 model API is currently in development.

## Features

- **Multi-Layer Generation**: Support for generating and compositing multiple image layers.
- **Studio Environment**: A focused workspace (`/create`) with granular control over generation parameters.
- **Advanced Inspection**: Custom magnifying glass tool for inspecting generated details at 1.25x magnification without loss of clarity.
- **Responsive Layout**: Adaptive control panel and gallery layouts for mobile and desktop workstations.
- **Authentication**: Integrated Clerk authentication for user session management.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19 rc
- **Styling**: Tailwind CSS 4
- **State**: Zustand
- **Graphics**: Three.js / OGL
- **Auth**: Clerk

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-org/glmimage.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment
   Create a `.env.local` file with required credentials:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

4. Start development server
   ```bash
   npm run dev
   ```

## License

Proprietary Software. All rights reserved.
