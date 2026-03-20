### Filmvisarna

## Technology stack
- TypeScript
- Node.js
- React Vite
- MySQL
- Postman (testing)
- Session-based authentication

## Requirements
### **System Requirements**

- Node.js v24.x
- Git
- A REST client (Ex. Bruno, Postman or Thunderclient)
- Local MySQL server version 9.2.0
- Configured connection string

### **Functional Requirements**

- [] Login authorization (User account)

## 🚀 How to Run

```
git clone git@github.com:hkmp1303/filmvisarna.git

cd filmvisarna

dotnet run
```

## Configuration
Configure the database connection string in

## Database Design
### EER Diagram
![EER Diagram](docs/Diagram75.png)

### Database Setup
While in MySQLWorkbench, open the setup.sql, data.ddl and data.sql files from the project folder. Select "View all file types" to ensure the data.ddl file is visible. Run the SQL scripts in the aforementioned order: [setup.sql](setup.sql), [data.ddl](data.ddl), [data.sql](data.sql). The setup.sql file creates the database and user while the tables are created by the data.ddl file. Finally, running the SQL queries in the data.sql file will populate the tables with mock data. The data can also be populated through Postman by reseting the database through `delete /db` once the API is running.

## API Overview

The API will be available via HTTP protocal at

### Key Endpoints


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
## Authors
This project was developed as a group asssignment.
- Heather Payne
  - @hkmp1303
- Mikael Renberg
  - @M-Renberg
- Oscar Kock
  - @OscarK99Swe
- Timoty Bengtsson
  - @pyr0xd

README authored by: Heather Payne
