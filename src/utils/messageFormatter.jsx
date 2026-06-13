import React from 'react';

export function formatMessage(text) {
  if (!text) return '';
  
  let html = text;
  
  // Bold: **text** 
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Italic: *text* (but not inside already-processed strong tags)
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  
  // Process lines
  const lines = html.split('\n');
  const processed = [];
  let inUl = false;
  let inOl = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Unordered list
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      if (!inUl) { processed.push('<ul>'); inUl = true; }
      if (inOl) { processed.push('</ol>'); inOl = false; }
      processed.push(`<li>${trimmed.replace(/^[-•]\s*/, '')}</li>`);
      continue;
    }
    
    // Ordered list
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (olMatch) {
      if (!inOl) { processed.push('<ol>'); inOl = true; }
      if (inUl) { processed.push('</ul>'); inUl = false; }
      processed.push(`<li>${olMatch[2]}</li>`);
      continue;
    }
    
    // Close any open lists
    if (inUl) { processed.push('</ul>'); inUl = false; }
    if (inOl) { processed.push('</ol>'); inOl = false; }
    
    // Regular line
    if (trimmed === '') {
      processed.push('<br />');
    } else {
      processed.push(`<p>${trimmed}</p>`);
    }
  }
  
  // Close any remaining open lists
  if (inUl) processed.push('</ul>');
  if (inOl) processed.push('</ol>');
  
  return processed.join('');
}

export function FormattedMessage({ text }) {
  const html = formatMessage(text);
  return <div className="formatted-message" dangerouslySetInnerHTML={{ __html: html }} />;
}
