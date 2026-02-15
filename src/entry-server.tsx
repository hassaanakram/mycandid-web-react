/**
 * Server-side entry point for SSR/SSG
 * Renders the React app to HTML string
 */
import { renderToString } from 'react-dom/server';
import App from './app/App';

export function render() {
  const html = renderToString(<App />);
  return html;
}
