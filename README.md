# Gerador de Etiquetas

Aplicativo web para geração de etiquetas a partir de arquivos CSV ou XLSX, com suporte para impressora de etiquetas Xd-210.

## Funcionalidades

- Importação de arquivos CSV e XLSX
- Edição do layout das etiquetas (posição e tamanho dos campos)
- Salvamento e carregamento de templates
- Prévia das etiquetas
- Impressão direta para impressora de etiquetas

## Requisitos

- Node.js 16 ou superior
- NPM ou Yarn

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Uso

1. Importe um arquivo CSV ou XLSX com as colunas:
   - CODIGO
   - PRODUTO
   - VALOR

2. Ajuste o layout das etiquetas usando o editor:
   - Posição X e Y de cada campo
   - Tamanho da fonte

3. Salve o template para uso futuro

4. Visualize a prévia das etiquetas

5. Imprima as etiquetas na impressora Xd-210

## Estrutura do Template

O template é salvo em um arquivo .txt com a seguinte estrutura:
```json
{
  "codigo": {
    "x": 10,
    "y": 10,
    "fontSize": 12
  },
  "produto": {
    "x": 10,
    "y": 30,
    "fontSize": 14
  },
  "valor": {
    "x": 10,
    "y": 50,
    "fontSize": 12
  }
}
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
