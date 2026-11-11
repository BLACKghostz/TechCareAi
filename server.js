import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';
import process from 'node:process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
try {
  process.loadEnvFile(path.join(__dirname, '.env'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const app = express();
const PORT = process.env.PORT || 3001;
const dbPath = path.join(__dirname, 'techcare.db');

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }

  console.log('Connected to SQLite database at', dbPath);
  initializeDatabase();
});

function runSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve(this);
    });
  });
}

function getSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row);
    });
  });
}

function allSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });
}

async function initializeDatabase() {
  const schema = `
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      company_name TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      price REAL NOT NULL,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      reorder_level INTEGER NOT NULL DEFAULT 10,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      total_amount REAL NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS support_issues (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      issue_title TEXT NOT NULL,
      issue_description TEXT,
      priority TEXT NOT NULL DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'open',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  for (const statement of schema
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)) {
    await runSql(`${statement};`);
  }

  const productCount = await getSql('SELECT COUNT(*) as total FROM products');
  if (!productCount || productCount.total === 0) {
    const starterProducts = [
      {
        sku: 'TECH-USB-C',
        name: 'USB-C Hub Pro',
        description: 'Multi-port expansion hub for laptops and workstations.',
        category: 'Accessories',
        price: 89.99,
        stock_quantity: 24,
        reorder_level: 6,
      },
      {
        sku: 'TECH-LAP-15',
        name: 'TechCare Laptop 15',
        description: 'AI-ready business laptop for office and remote work.',
        category: 'Hardware',
        price: 1249.0,
        stock_quantity: 12,
        reorder_level: 5,
      },
      {
        sku: 'TECH-SSD-1TB',
        name: '1TB NVMe SSD',
        description: 'Fast storage upgrade for performance-focused systems.',
        category: 'Storage',
        price: 149.5,
        stock_quantity: 18,
        reorder_level: 7,
      },
      {
        sku: 'TECH-WIFI-AX',
        name: 'Wi-Fi 6 Router',
        description: 'Reliable networking for home and office coverage.',
        category: 'Networking',
        price: 109.99,
        stock_quantity: 16,
        reorder_level: 8,
      }
    ];

    for (const product of starterProducts) {
      await runSql(
        `INSERT INTO products (id, sku, name, description, category, price, stock_quantity, reorder_level)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [randomUUID(), product.sku, product.name, product.description, product.category, product.price, product.stock_quantity, product.reorder_level]
      );
    }
  }

  const customerCount = await getSql('SELECT COUNT(*) as total FROM customers');
  if (!customerCount || customerCount.total === 0) {
    const starterCustomers = [
      { full_name: 'Aisha Patel', email: 'aisha.patel@example.com', phone: '+91 98765 43210', company_name: 'Bluepeak Labs' },
      { full_name: 'Daniel Brooks', email: 'daniel.brooks@example.com', phone: '+1 (415) 321-8820', company_name: 'Northwind Desk' },
      { full_name: 'Sofia Nguyen', email: 'sofia.nguyen@example.com', phone: '+44 7700 900123', company_name: 'Nova Systems' }
    ];

    for (const customer of starterCustomers) {
      await runSql(
        `INSERT INTO customers (id, full_name, email, phone, company_name)
         VALUES (?, ?, ?, ?, ?)`,
        [randomUUID(), customer.full_name, customer.email, customer.phone, customer.company_name]
      );
    }
  }

  const orderCount = await getSql('SELECT COUNT(*) as total FROM orders');
  if (!orderCount || orderCount.total === 0) {
    const starterOrders = [
      { order_number: 'TC-1001', customer_name: 'Aisha Patel', status: 'processing', total_amount: 1249.0 },
      { order_number: 'TC-1002', customer_name: 'Daniel Brooks', status: 'shipped', total_amount: 89.99 },
      { order_number: 'TC-1003', customer_name: 'Sofia Nguyen', status: 'pending', total_amount: 259.49 }
    ];

    for (const order of starterOrders) {
      await runSql(
        `INSERT INTO orders (id, order_number, customer_name, status, total_amount)
         VALUES (?, ?, ?, ?, ?)`,
        [randomUUID(), order.order_number, order.customer_name, order.status, order.total_amount]
      );
    }
  }

  const issueCount = await getSql('SELECT COUNT(*) as total FROM support_issues');
  if (!issueCount || issueCount.total === 0) {
    const starterIssues = [
      { customer_name: 'Aisha Patel', issue_title: 'Laptop running slowly', issue_description: 'Need a performance check and cleanup guidance.', priority: 'high', status: 'open' },
      { customer_name: 'Daniel Brooks', issue_title: 'Wi-Fi keeps disconnecting', issue_description: 'Router and signal diagnostics needed.', priority: 'medium', status: 'in-progress' },
      { customer_name: 'Sofia Nguyen', issue_title: 'Windows update stuck', issue_description: 'Update failed after restart and disk check is recommended.', priority: 'high', status: 'open' }
    ];

    for (const issue of starterIssues) {
      await runSql(
        `INSERT INTO support_issues (id, customer_name, issue_title, issue_description, priority, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [randomUUID(), issue.customer_name, issue.issue_title, issue.issue_description, issue.priority, issue.status]
      );
    }
  }
}

app.get('/api/health', (request, response) => {
  response.json({
    status: 'ok',
    message: 'TechCare AI backend is running.',
    database: dbPath,
    time: new Date().toISOString()
  });
});

app.get('/api/dashboard', async (request, response) => {
  try {
    const metrics = await Promise.all([
      getSql('SELECT COUNT(*) as totalProducts FROM products'),
      getSql('SELECT COUNT(*) as totalOrders FROM orders'),
      getSql('SELECT COALESCE(SUM(total_amount), 0) as revenue FROM orders'),
      getSql("SELECT COUNT(*) as openIssues FROM support_issues WHERE status != 'resolved'")
    ]);

    const [productsRow, ordersRow, revenueRow, issuesRow] = metrics;
    const products = await allSql('SELECT * FROM products ORDER BY created_at DESC LIMIT 6');
    const orders = await allSql('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5');
    const issues = await allSql('SELECT * FROM support_issues ORDER BY created_at DESC LIMIT 4');

    response.json({
      metrics: {
        totalProducts: productsRow.totalProducts,
        totalOrders: ordersRow.totalOrders,
        revenue: Number(revenueRow.revenue || 0),
        openIssues: issuesRow.openIssues
      },
      products,
      orders,
      issues
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    response.status(500).json({ error: 'Unable to load dashboard data.' });
  }
});

app.get('/api/products', async (request, response) => {
  try {
    const rows = await allSql('SELECT * FROM products ORDER BY created_at DESC');
    response.json(rows);
  } catch (error) {
    console.error('Products fetch error:', error);
    response.status(500).json({ error: 'Failed to fetch products.' });
  }
});

app.post('/api/products', async (request, response) => {
  try {
    const {
      sku,
      name,
      description = '',
      category = 'General',
      price = 0,
      stock_quantity = 0,
      reorder_level = 10
    } = request.body || {};

    if (!sku || !name) {
      return response.status(400).json({ error: 'Product sku and name are required.' });
    }

    const id = randomUUID();
    await runSql(
      `INSERT INTO products (id, sku, name, description, category, price, stock_quantity, reorder_level)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, sku, name, description, category, Number(price), Number(stock_quantity), Number(reorder_level)]
    );

    const product = await getSql('SELECT * FROM products WHERE id = ?', [id]);
    response.status(201).json(product);
  } catch (error) {
    console.error('Product create error:', error);
    response.status(500).json({ error: 'Failed to create product.' });
  }
});

app.patch('/api/products/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const updates = request.body || {};
    const fields = [];
    const values = [];

    if (updates.stock_quantity !== undefined) {
      fields.push('stock_quantity = ?');
      values.push(Number(updates.stock_quantity));
    }

    if (updates.price !== undefined) {
      fields.push('price = ?');
      values.push(Number(updates.price));
    }

    if (updates.reorder_level !== undefined) {
      fields.push('reorder_level = ?');
      values.push(Number(updates.reorder_level));
    }

    if (fields.length === 0) {
      return response.status(400).json({ error: 'No valid updates provided.' });
    }

    values.push(id);
    await runSql(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
    const product = await getSql('SELECT * FROM products WHERE id = ?', [id]);
    response.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    response.status(500).json({ error: 'Failed to update product.' });
  }
});

app.get('/api/orders', async (request, response) => {
  try {
    const rows = await allSql('SELECT * FROM orders ORDER BY created_at DESC');
    response.json(rows);
  } catch (error) {
    console.error('Orders fetch error:', error);
    response.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

app.post('/api/orders', async (request, response) => {
  try {
    const {
      order_number,
      customer_name,
      status = 'pending',
      total_amount = 0
    } = request.body || {};

    if (!order_number || !customer_name) {
      return response.status(400).json({ error: 'Order number and customer name are required.' });
    }

    const id = randomUUID();
    await runSql(
      `INSERT INTO orders (id, order_number, customer_name, status, total_amount)
       VALUES (?, ?, ?, ?, ?)`,
      [id, order_number, customer_name, status, Number(total_amount)]
    );

    const order = await getSql('SELECT * FROM orders WHERE id = ?', [id]);
    response.status(201).json(order);
  } catch (error) {
    console.error('Order create error:', error);
    response.status(500).json({ error: 'Failed to create order.' });
  }
});

app.get('/api/issues', async (request, response) => {
  try {
    const rows = await allSql('SELECT * FROM support_issues ORDER BY created_at DESC');
    response.json(rows);
  } catch (error) {
    console.error('Issues fetch error:', error);
    response.status(500).json({ error: 'Failed to fetch support issues.' });
  }
});

app.post('/api/issues', async (request, response) => {
  try {
    const {
      customer_name = 'Guest User',
      issue_title = 'New support request',
      issue_description = '',
      priority = 'medium'
    } = request.body || {};

    if (!issue_description.trim()) {
      return response.status(400).json({ error: 'Issue description is required.' });
    }

    const id = randomUUID();
    await runSql(
      `INSERT INTO support_issues (id, customer_name, issue_title, issue_description, priority, status)
       VALUES (?, ?, ?, ?, ?, 'open')`,
      [id, customer_name, issue_title, issue_description, priority]
    );

    const issue = await getSql('SELECT * FROM support_issues WHERE id = ?', [id]);
    response.status(201).json(issue);
  } catch (error) {
    console.error('Issues create error:', error);
    response.status(500).json({ error: 'Failed to create support issue.' });
  }
});

function normalizeMessage(message = '') {
  return String(message).toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function detectIssueProfile(message) {
  const normalized = normalizeMessage(message);

  const profiles = [
    {
      keywords: ['slow', 'lag', 'sluggish', 'stuck', 'performance', 'cpu', 'ram', 'browser slow', 'computer slow'],
      issueTitle: 'System performance issue',
      priority: 'high',
      prompts: ['When did it start?', 'Does it happen in every app?', 'Did anything change recently?'],
      nextStep: 'Open Task Manager and sort by CPU, Memory, and Disk. Note the process that stays near the top while the slowdown happens; do not end unfamiliar system processes.',
      followUpQuestion: 'Which resource or app is using the most, and how much free disk space is left?',
      response: 'This usually points to resource pressure or background apps. Open Task Manager, disable unnecessary startup programs, clear temporary files, and check whether the issue began after a recent update or install.'
    },
    {
      keywords: ['wifi', 'wi fi', 'internet', 'network', 'offline', 'router', 'signal', 'dns', 'ping', 'connection'],
      issueTitle: 'Network connectivity issue',
      priority: 'high',
      prompts: ['Does another device connect?', 'Is it Wi-Fi or wired?', 'When did it start?'],
      nextStep: 'Check whether another device drops from the same network. If only this computer is affected, turn Wi-Fi off and on, then reconnect; if every device is affected, check the router or contact your internet provider.',
      followUpQuestion: 'Does the disconnect affect just this computer or every device on the network?',
      response: 'For Wi‑Fi or internet problems, restart the router, forget and reconnect to the network, and confirm the adapter is enabled. If it still fails, test another device and check whether the issue is local to one PC or your whole network.'
    },
    {
      keywords: ['virus', 'malware', 'trojan', 'ransomware', 'scam', 'phishing', 'suspicious', 'antivirus', 'security'],
      issueTitle: 'Security threat concern',
      priority: 'high',
      prompts: ['What alert did you see?', 'Is the device still online?', 'When did this begin?'],
      nextStep: 'Avoid clicking the alert or entering passwords through its links. Open the security app from the Start menu or system tray yourself, check its protection history, and run a full scan. If files are being encrypted, disconnect the device from Wi-Fi.',
      followUpQuestion: 'What exact alert or behavior did you notice, and which security app reported it?',
      response: 'Run a complete malware scan, update antivirus definitions, remove unfamiliar browser extensions, and check the startup apps list for anything suspicious. If the device is locked or encrypted, isolate it and back up critical data immediately.'
    },
    {
      keywords: ['blue screen', 'bsod', 'crash', 'freeze', 'restart loop', 'boot loop', 'startup', 'update failed', 'install failed', 'windows update'],
      issueTitle: 'System update or crash issue',
      priority: 'high',
      prompts: ['What error code appears?', 'Can it start in Safe Mode?', 'Which update or app changed?'],
      nextStep: 'Write down the exact stop or update error code and note when it appears. If Windows still opens, check Update history and roll back only the most recent suspect driver or update; back up important files first.',
      followUpQuestion: 'What exact error code do you see, and can you still reach the Windows desktop?',
      response: 'Back up important files first, then check recent updates and driver changes. If the PC crashes on startup, try Safe Mode and use a restore point or startup repair to recover before reinstalling anything.'
    },
    {
      keywords: ['printer', 'usb', 'mouse', 'keyboard', 'screen', 'monitor', 'fan', 'overheat', 'battery', 'hardware', 'device not detected'],
      issueTitle: 'Hardware diagnosis request',
      priority: 'medium',
      prompts: ['What device model is it?', 'Does another cable or port work?', 'Do you see an error message?'],
      nextStep: 'Disconnect and reconnect the device, try a different cable or port, and check the device queue/settings for a paused or offline state. For a printer, verify it and the computer are on the same network.',
      followUpQuestion: 'What is the device model, and does it show an error or appear as offline?',
      response: 'Hardware problems are often tied to power, connection, or heat. Check the cable or port, test another device, inspect for overheating, and review battery or device health diagnostics from the manufacturer.'
    },
    {
      keywords: ['app', 'program', 'software', 'error', 'not working', 'won t open', 'application', 'login', 'password'],
      issueTitle: 'Software application issue',
      priority: 'medium',
      prompts: ['Which app is affected?', 'What does the error say?', 'When did it last work?'],
      nextStep: 'Check whether the app has an update and whether the same task works in another app or browser. Note the exact error text before trying a repair or reinstall, so any unsaved local data is not lost.',
      followUpQuestion: 'Which app is affected, and what is the exact error or behavior?',
      response: 'Start with a quick app reset: close the program, restart the machine, update the software, and verify permissions or admin access. If the error persists, check the event logs or reinstall the app in a clean state.'
    },
    {
      keywords: ['missing file', 'deleted file', 'data', 'backup', 'restore', 'lost', 'recovery'],
      issueTitle: 'Data recovery concern',
      priority: 'medium',
      prompts: ['Which files are missing?', 'When were they last available?', 'Do you have a backup?'],
      nextStep: 'Check the Recycle Bin and your backup or cloud version history first. If the files were on an external or failing drive, stop using that drive to avoid overwriting recoverable data.',
      followUpQuestion: 'Where were the files stored, and do you have File History, cloud sync, or another backup?',
      response: 'Do not write new data to the same drive until recovery is attempted. Stop using the device, check whether files are in the recycle bin or backup, and consider using a trusted recovery tool or backup restore path.'
    }
  ];

  for (const profile of profiles) {
    if (profile.keywords.some((keyword) => normalized.includes(keyword))) {
      return profile;
    }
  }

  return {
    issueTitle: 'General troubleshooting request',
    priority: 'medium',
    prompts: ['What device are you using?', 'What did you expect to happen?', 'What happened instead?'],
    response: 'I can help with this. Please tell me whether the issue is related to computer speed, Wi‑Fi/network, app/software errors, hardware, or a startup/update problem so I can narrow the right fix quickly.'
  };
}

function getConversationContext(message, history = []) {
  const recentUserMessages = Array.isArray(history)
    ? history.filter((item) => item?.role === 'user' && typeof item.content === 'string').slice(-8)
    : [];
  const previousIssue = recentUserMessages
    .reverse()
    .map((item) => detectIssueProfile(item.content))
    .find((item) => item.issueTitle !== 'General troubleshooting request');
  const profile = detectIssueProfile(message);
  const normalizedMessage = normalizeMessage(message);
  const isContinuation = /^(yes|no|still|same|tried|already|that did not|it did not|does not|did not|not yet|i tried|i did|restarted|rebooted|after that)\b/.test(normalizedMessage);
  const isBriefSameIssue = profile.issueTitle === previousIssue?.issueTitle
    && normalizedMessage.split(' ').length <= 6;
  const isFollowUp = Boolean(previousIssue && (
    profile.issueTitle === 'General troubleshooting request' || isContinuation || isBriefSameIssue
  ));

  return { profile: isFollowUp ? previousIssue : profile, isFollowUp };
}

function getDirectAnswer(message) {
  const normalized = normalizeMessage(message);

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(normalized)) {
    return 'Hi! Tell me what you are trying to do and what happened. I can help with Windows, Wi-Fi, apps, printers, security alerts, and computer performance.';
  }

  if (/^(thanks|thank you|thx)\b/.test(normalized)) {
    return 'You are welcome. If the problem comes back, tell me what changed and what you have already tried, and I will continue from there.';
  }

  if (/what can you do|how can you help/.test(normalized)) {
    return 'I can explain common computer terms and help troubleshoot Windows, Wi-Fi, slow performance, software errors, printers, hardware symptoms, and security alerts. Describe the device and what you see for more specific steps.';
  }

  const answers = [
    {
      pattern: /\bwhat is (a )?vpn\b|\bwhat does vpn mean\b/,
      response: 'A VPN creates an encrypted connection between your device and a VPN provider, which can protect traffic on untrusted networks and make your connection appear to come from another location. It does not make you fully anonymous or protect you from malware and phishing.'
    },
    {
      pattern: /\bwhat is (a )?dns\b|\bwhat does dns mean\b/,
      response: 'DNS is the internet service that looks up a domain name, such as example.com, and returns the address computers use to connect to it. If DNS is failing, sites may not load by name even when the network is connected.'
    },
    {
      pattern: /\bwhat is (a )?ram\b|\bwhat does ram mean\b/,
      response: 'RAM is short-term working memory used by open apps and the operating system. More RAM can help when many apps are open, but a full disk or a busy CPU can also make a computer slow.'
    },
    {
      pattern: /\bwhat is (a )?phishing\b|\bwhat does phishing mean\b/,
      response: 'Phishing is a deceptive message or website designed to make you reveal information, open a harmful attachment, or approve a payment. Do not use its links; open the organization’s official app or type its known address yourself.'
    },
    {
      pattern: /\bwhat is (a )?malware\b|\bwhat does malware mean\b/,
      response: 'Malware is software intended to harm a device, spy on activity, steal information, or take control of files. Keep security updates enabled, avoid unexpected attachments, and use your trusted security app to scan suspicious activity.'
    },
    {
      pattern: /\bhow (do i|to) (take )?(a )?screenshot\b/,
      response: 'On Windows, press Windows+Shift+S to select an area; the capture is copied so you can paste it into a message or document. Press Print Screen for the full-screen capture options available on your device.'
    }
  ];

  return answers.find((item) => item.pattern.test(normalized))?.response;
}

async function getFallbackAiResponse(trimmedMessage, history = []) {
  const directAnswer = getDirectAnswer(trimmedMessage);
  if (directAnswer) {
    return {
      issueTitle: 'General troubleshooting request',
      priority: 'medium',
      response: directAnswer
    };
  }

  const { profile, isFollowUp } = getConversationContext(trimmedMessage, history);
  const assistantHistory = Array.isArray(history)
    ? history.filter((item) => item?.role === 'assistant' && typeof item.content === 'string')
    : [];
  const hasTriedPreviousSteps = /\b(tried|already|did that|done that|still|same|again|no change|did not work|does not work)\b/.test(normalizeMessage(trimmedMessage));
  const response = isFollowUp
    ? hasTriedPreviousSteps
      ? `${profile.nextStep || profile.response} ${profile.followUpQuestion || 'What exact result or error do you see?'} `
      : `Got it. For your ${profile.issueTitle.toLowerCase()}, ${profile.followUpQuestion || 'What exact result or error do you see?'}`
    : `${profile.response} ${profile.followUpQuestion || 'What exact result or error do you see?'}`;

  const avoidsExactReplay = assistantHistory.length === 0
    || !assistantHistory.at(-1).content.includes(profile.response);
  const finalResponse = isFollowUp && !hasTriedPreviousSteps && !avoidsExactReplay
    ? `${profile.nextStep || profile.response} ${profile.followUpQuestion || 'What exact result or error do you see?'}`
    : response;

  return { ...profile, response: finalResponse };
}

async function getAiResponse(trimmedMessage, history = []) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return getFallbackAiResponse(trimmedMessage, history);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are TechCare AI, a friendly and careful computer support assistant. Use the recent conversation for context, acknowledge what the user has already told you, and ask at most one focused follow-up question when needed. Give clear, safe, step-by-step guidance. Never claim to have diagnosed hardware remotely.'
          },
          ...(Array.isArray(history)
            ? history
                .filter((item) => ['user', 'assistant'].includes(item?.role) && typeof item.content === 'string')
                .slice(-8)
                .map((item) => ({ role: item.role, content: item.content.slice(0, 1000) }))
            : []),
          {
            role: 'user',
            content: trimmedMessage
          }
        ],
        temperature: 0.5,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error('Empty AI response');
    }

    const { profile } = getConversationContext(trimmedMessage, history);
    const issueTitle = profile.issueTitle;
    const priority = profile.priority;

    return { ...profile, response: content };
  } catch (error) {
    console.warn('OpenAI request failed. Falling back to local rules:', error.message);
    return getFallbackAiResponse(trimmedMessage, history);
  }
}

app.get('/api/chat/suggestions', (request, response) => {
  const query = String(request.query.q || '').trim();
  if (!query) {
    return response.json({ issueTitle: 'Describe your issue', priority: 'medium', prompts: [] });
  }

  const { profile } = getConversationContext(query);
  response.json({
    issueTitle: profile.issueTitle,
    priority: profile.priority,
    prompts: profile.prompts
  });
});

app.post('/api/chat', async (request, response) => {
  try {
    const { message = '', customer_name = 'Guest User', history = [] } = request.body || {};
    const trimmedMessage = String(message).trim();

    if (!trimmedMessage) {
      return response.status(400).json({ error: 'Message is required.' });
    }

    const aiResult = await getAiResponse(trimmedMessage, history);
    const issueId = randomUUID();

    await runSql(
      `INSERT INTO support_issues (id, customer_name, issue_title, issue_description, priority, status)
       VALUES (?, ?, ?, ?, ?, 'open')`,
      [issueId, customer_name, aiResult.issueTitle, trimmedMessage, aiResult.priority]
    );

    response.json({
      status: 'ok',
      issueTitle: aiResult.issueTitle,
      priority: aiResult.priority,
      response: aiResult.response
    });
  } catch (error) {
    console.error('Chat error:', error);
    response.status(500).json({ error: 'Failed to process support request.' });
  }
});

app.listen(PORT, () => {
  console.log(`TechCare AI backend listening on http://localhost:${PORT}`);
});
