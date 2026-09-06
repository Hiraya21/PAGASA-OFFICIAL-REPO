/**
 * Google Workspace Gmail Service
 * Integrates directly with the Gmail REST API (v1) using the OAuth Access Token.
 * Supports sending transactional credential emails, member announcements, reading messages,
 * and managing drafts.
 */

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  internalDate?: string;
  from?: string;
  to?: string;
  subject?: string;
  date?: string;
}

export interface SendGmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
  plainTextContent?: string;
  fromName?: string;
  replyTo?: string;
}

// In-memory token cache (never stored in localStorage for security)
let inMemoryAccessToken: string | null = null;
let connectedGmailEmail: string | null = null;

export function setGmailAccessToken(token: string | null, email?: string | null) {
  inMemoryAccessToken = token;
  if (email) {
    connectedGmailEmail = email;
  } else if (!token) {
    connectedGmailEmail = null;
  }
}

export function getGmailAccessToken(): string | null {
  return inMemoryAccessToken;
}

export function getConnectedGmailEmail(): string | null {
  return connectedGmailEmail;
}

export function isGmailConnected(): boolean {
  return Boolean(inMemoryAccessToken);
}

/**
 * Creates an RFC 2822 formatted email and returns the base64url encoded string
 */
export function buildRfc2822RawMessage(options: SendGmailOptions): string {
  const { to, subject, htmlContent, plainTextContent, fromName, replyTo } = options;
  const fromEmail = connectedGmailEmail || 'me';
  const fromHeader = fromName ? `"${fromName}" <${fromEmail}>` : fromEmail;
  const boundary = `__PAGASA_GMAIL_BOUNDARY_${Date.now()}_${Math.random().toString(36).substring(2)}__`;
  
  // Clean plain text fallback
  const plainText = plainTextContent || htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // Encode subject in UTF-8 Base64
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;

  const headers = [
    `To: ${to}`,
    `From: ${fromHeader}`,
    ...(replyTo ? [`Reply-To: ${replyTo}`] : []),
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    plainText,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    htmlContent,
    '',
    `--${boundary}--`
  ];

  const raw = headers.join('\r\n');

  // Convert to base64url
  return btoa(unescape(encodeURIComponent(raw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends an email directly through the Gmail API using the authorized user's access token
 */
export async function sendEmailViaGmailApi(
  options: SendGmailOptions,
  token?: string | null
): Promise<{ success: boolean; messageId?: string; threadId?: string; error?: string }> {
  const activeToken = token || inMemoryAccessToken;
  if (!activeToken) {
    return {
      success: false,
      error: 'Gmail is not connected. Please sign in with Google to grant Gmail API access.'
    };
  }

  try {
    const rawMessage = buildRfc2822RawMessage(options);

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${activeToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        raw: rawMessage
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Gmail API] Send failed:', errorData);
      const errorMessage = errorData.error?.message || `Gmail API HTTP ${response.status}: ${response.statusText}`;
      return {
        success: false,
        error: errorMessage
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.id,
      threadId: data.threadId
    };
  } catch (err: any) {
    console.error('[Gmail API] Error:', err);
    return {
      success: false,
      error: err?.message || 'Network error while contacting Gmail API.'
    };
  }
}

/**
 * Fetches the connected user's Gmail profile
 */
export async function fetchGmailProfile(token?: string | null): Promise<GmailProfile | null> {
  const activeToken = token || inMemoryAccessToken;
  if (!activeToken) return null;

  try {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        'Authorization': `Bearer ${activeToken}`
      }
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn('[Gmail API] Failed to fetch profile:', err);
    return null;
  }
}

/**
 * Lists recent messages or sent emails
 */
export async function listRecentGmailMessages(
  query: string = '',
  maxResults: number = 10,
  token?: string | null
): Promise<GmailMessageSummary[]> {
  const activeToken = token || inMemoryAccessToken;
  if (!activeToken) return [];

  try {
    const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
    url.searchParams.set('maxResults', maxResults.toString());
    if (query) url.searchParams.set('q', query);

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${activeToken}`
      }
    });

    if (!response.ok) return [];
    const data = await response.json();
    const messages = data.messages || [];

    // Fetch details for first few messages
    const detailed = await Promise.all(
      messages.slice(0, 5).map(async (msg: { id: string; threadId: string }) => {
        try {
          const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`, {
            headers: { 'Authorization': `Bearer ${activeToken}` }
          });
          if (!detailRes.ok) return { id: msg.id, threadId: msg.threadId };
          const detail = await detailRes.json();
          const headers = detail.payload?.headers || [];
          const getHeader = (name: string) => headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

          return {
            id: detail.id,
            threadId: detail.threadId,
            labelIds: detail.labelIds,
            snippet: detail.snippet,
            internalDate: detail.internalDate,
            from: getHeader('From'),
            to: getHeader('To'),
            subject: getHeader('Subject'),
            date: getHeader('Date')
          };
        } catch {
          return { id: msg.id, threadId: msg.threadId };
        }
      })
    );

    return detailed;
  } catch (err) {
    console.warn('[Gmail API] Failed to list messages:', err);
    return [];
  }
}
