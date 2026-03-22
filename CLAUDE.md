# PoliCard

## Project Goal
An app to make US politicians more transparent and accessible. Uses LLMs + web search to collect and surface:
- Voting records, news, ideological scores
- Local and lesser-known election candidates
- Up-to-date info as it happens (AI-driven data collection)

Community discussion features (Reddit-style) are a long-term goal.

## Target Platform
**Primary:** React Native (Expo) mobile app
**Secondary:** Web (down the line)

## Stack
- **Monorepo:** Yarn workspaces (`apps/web`, `apps/graphql`, `apps/mobile`)
- **Mobile:** React Native + Expo + Apollo Client + Redux Toolkit
- **Backend:** GraphQL server (Node/TypeScript, Webpack)
- **Auth:** AWS Cognito
- **Cloud:** AWS
- **Codegen:** GraphQL Code Generator

## Context
- Solo developer project
- Spawned from a prior virtual tour guide project — much of the scaffolding is inherited from that and will need to be replaced or repurposed
- Package names still reference `commercialwebsite` from the original project and should be updated
