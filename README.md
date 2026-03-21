### Filmvisarna
A project for the fictive company Filmvisarna AB which is a samll, local cinema. The project frontend is written in TypeScript, the backend in C# featuring session based authentication and MySQL data storage.

The cinema offers showings four times a day in each of their two salons. The company's initial requests include displaying movie and screening information including screening dates, times and movie trailers. Site visitors can booking tickets online and recieve a confrimation which includes seat number and row, total cost and booking number.


## Technology stack
- Frontend
  - TypeScript
  - Node.js
  - React + Vite
- Backend
  - C# .Net
  - MySQL
  - Session-based authentication
  - MailKit library
- Tooling
  - Postman (testing)

## Requirements
### **System Requirements**

- Node.js v24.x
- Git
- Developed on MySQL server version 8.0.41 or higher
- Configured connection string

### **Functional Requirements**

- [] Login authorization (User account)

## 🚀 How to Run

For inital setup
```shell
git clone git@github.com:hkmp1303/filmvisarna.git

cd filmvisarna

npm install
```
Once setup is complete
```shell
npm run dev
```

## Configuration
Configure the database connection string in `backend/db-config.json`. For initial setup use [backend/db-config.template.json](backend/db-config.template.json) which can be copied, renamed and filled in with the correct values.

## Database Design
### EER Diagram
![EER Diagram](docs/Diagram75.png)

### Database Setup
While in MySQLWorkbench, open the setup.sql, data.ddl and data.sql files from the project folder. Select "View all file types" to ensure the data.ddl file is visible. Run the SQL scripts in the order:
- [setup.sql](setup.sql)
- [backend/data.ddl](backend/data.ddl)
- [backend/data.sql](backend/data.sql)
- [backend/procedure.ddl](backend/procedure.ddl)

The setup.sql file creates the database and user while the tables are created by the data.ddl file. Finally, running the SQL queries in the data.sql file will populate the tables with mock data and the procedure.ddl creates the stored procedure(s). The data can also be populated using Postman. First reset the database with `delete /resetdb` while the API is running. Then restart the project using `npm run dev`. Note that only the table data will be repopulated.

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
- Heather
  - @hkmp1303
- Mikael
  - @M-Renberg
- Oscar
  - @OscarK99Swe
- Timoty
  - @pyr0xd

README authored by: Heather
