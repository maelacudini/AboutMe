# About Me

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Description

"About Me" is a personal project built with Next.js, designed to gather users personal links in one place and make it easier to share them. It includes a dynamic user interface, responsive design, and integration with MongoDB for data management. The project leverages modern web technologies and libraries to provide a seamless user experience.

## Getting Started

To get started with the project, follow these steps:

### Prerequisites

- Node.js (v14 or later)
- npm, yarn, pnpm, or bun (any package manager of your choice)
- MongoDB (set up a MongoDB database and get the connection URI)
- Environment variables:
  - `MONGODB_URI` (MongoDB connection URI)
  - `NEXTAUTH_SECRET` (NextAuth secret key)
  - `NEXTAUTH_URL` (NextAuth URL)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/maelacudini/AboutMe.git
   cd AboutMe
   ```

2. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Create a `.env` file in the root directory and add the required environment variables:

   ```bash
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=your_nextauth_url
   ```

### Running the Development Server

To run the development server, use the following command:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Adding a New Language

To add a new language to the project, follow these steps:

1. Create a new subdirectory in the `locales` directory with the language code as the name (e.g., `locales/fr` for French).

2. Add translation files for the new language in the newly created subdirectory. The translation files should follow the same structure as existing translation files.

3. Update the `next.config.js` file to include the new language in the `i18n` configuration:

   ```javascript
   module.exports = {
     i18n: {
       locales: ['en', 'es', 'fr'], // Add the new language code here
       defaultLocale: 'en',
     },
   };
   ```

4. Use the `useTranslation` hook from `next-i18next` to access translations in your components:

   ```javascript
   import { useTranslation } from 'next-i18next';

   const MyComponent = () => {
     const { t } = useTranslation('common');

     return <p>{t('welcome_message')}</p>;
   };
   ```

### Folder Organization

1. Components
The components inside app/_components are organized taking inspiration from the Atomic design:
- ATOMS: basic HTML elements like form labels, inputs, buttons, and others that can’t be broken down any further without ceasing to be functional.
- MOLECULES: relatively simple groups of UI elements functioning together as a unit. (e..g. a form label, search input, and button can join together to create a search form molecule). Simple UI molecules should makes testing easier, encourage reusability, and promote consistency throughout the interface.
- ORGANISMS: relatively complex UI components composed of groups of molecules and/or atoms and/or other organisms. 
- LAYOUTS: common templates used in one or more components to keep the same design logic everywhere.
- SHADCN: Shadcn components.

2. API
You can find all apis inside app/api, and the respective functions to use some of them inside utils/api.

3. Server Actions
This project uses apis as well as server actions, in case of a post request. The server actions can be found inside utils/server/actions.

4. Functions and Constants
All common contants and functions can be found inside utils. The server functions are kept separated in utils/server/functions.