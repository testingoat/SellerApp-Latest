import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Authentication credentials (in production, use environment variables)
const AUTH_USERNAME = process.env.LOGS_USERNAME || 'admin';
const AUTH_PASSWORD = process.env.LOGS_PASSWORD || 'GoatGoat@2025';

// Basic Authentication middleware
function basicAuth(request, reply, done) {
  const authHeader = request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    reply.code(401);
    reply.header('WWW-Authenticate', 'Basic realm="GoatGoat Logs Viewer"');
    reply.send({ error: 'Authentication required' });
    return;
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  if (username !== AUTH_USERNAME || password !== AUTH_PASSWORD) {
    reply.code(401);
    reply.header('WWW-Authenticate', 'Basic realm="GoatGoat Logs Viewer"');
    reply.send({ error: 'Invalid credentials' });
    return;
  }

  done();
}

function getLastLines(filePath, numLines = 100) {
  try {
    if (!fs.existsSync(filePath)) {
      return [`Log file not found: ${filePath}`];
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    return lines.slice(-numLines);
  } catch (error) {
    return [`Error reading log file: ${error.message}`];
  }
}

export default async function logsStreamRoutes(app, options) {
  // API endpoint to fetch logs (with authentication)
  app.get('/api/logs', { preHandler: basicAuth }, async (request, reply) => {
    const { env = 'production', type = 'output', lines = 100 } = request.query;
    
    const logFile = LOG_FILES[env]?.[type];
    if (!logFile) {
      return reply.code(400).send({ 
        error: 'Invalid parameters',
        validEnvs: Object.keys(LOG_FILES),
        validTypes: ['output', 'error']
      });
    }

    const logs = getLastLines(logFile, parseInt(lines));
    
    return {
      logs,
      env,
      type,
      count: logs.length,
      timestamp: new Date().toISOString()
    };
  });

  // HTML log viewer (with authentication)
  app.get('/logs-viewer', { preHandler: basicAuth }, async (request, reply) => {
    const htmlPath = path.join(__dirname, '../public/logs-viewer.html');
    
    if (!fs.existsSync(htmlPath)) {
      return reply.code(404).send({ error: 'Log viewer HTML not found' });
    }

    const html = fs.readFileSync(htmlPath, 'utf8');
    reply.type('text/html');
    return html;
  });

  // Health check endpoint (no authentication required)
  app.get('/api/logs/health', async (request, reply) => {
    return {
      status: 'ok',
      message: 'Logs API is running',
      timestamp: new Date().toISOString(),
      authRequired: true
    };
  });
}

