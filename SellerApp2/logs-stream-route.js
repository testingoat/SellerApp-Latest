import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log file paths
const LOG_FILES = {
  production: {
    output: '/var/www/goatgoat-production/server/logs/📄-production-output.log',
    error: '/var/www/goatgoat-production/server/logs/🚨-production-error.log'
  },
  staging: {
    output: '/var/www/goatgoat-staging/server/logs/📄-staging-output.log',
    error: '/var/www/goatgoat-staging/server/logs/🚨-staging-error.log'
  }
};

// Get last N lines from a file
function getLastLines(filePath, numLines = 100) {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    return lines.slice(-numLines);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

// Fastify plugin for logs streaming
export default async function logsStreamRoutes(app, options) {
  // API endpoint to get logs
  app.get('/api/logs', async (request, reply) => {
    const { env = 'production', type = 'output', lines = 100 } = request.query;

    const logFile = LOG_FILES[env]?.[type];
    if (!logFile) {
      reply.status(400);
      return { error: 'Invalid environment or log type' };
    }

    const logs = getLastLines(logFile, parseInt(lines));
    return { logs, env, type, count: logs.length };
  });

  // HTML page for log viewer
  app.get('/logs-viewer', async (request, reply) => {
    const htmlPath = path.join(__dirname, '../public/logs-viewer.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    reply.type('text/html');
    return html;
  });
}

