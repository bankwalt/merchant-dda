#!/usr/bin/env node
// Converts .docx disclosures in /disclosures to styled HTML in /public/disclosures.
// Run: node scripts/build-disclosures.mjs

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import mammoth from 'mammoth'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const srcDir = join(root, 'disclosures')
const outDir = join(root, 'public', 'disclosures')

const slugMap = {
  'Deposit Account TC SMB DDA': 'deposit',
  'Jaris Business Savings Disclosure': 'savings',
  'Account Fee Schedule': 'fees',
  'Visa Business Debit Card Agreement': 'debit-card',
}

function resolveSlug(filename) {
  const stem = basename(filename, '.docx')
  for (const [prefix, slug] of Object.entries(slugMap)) {
    if (stem.startsWith(prefix)) return slug
  }
  return stem
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

// Strip <table>...LEGAL REVIEW NOTE...</table> blocks — those are internal
// compliance annotations, not merchant-facing content.
function stripLegalReviewTables(html) {
  return html.replace(
    /<table>[\s\S]*?LEGAL REVIEW NOTE[\s\S]*?<\/table>/gi,
    ''
  )
}

// Word docs typically open with: <p><strong>Title</strong></p> <p>Subtitle</p>
// <p><em>Effective: ... | vX.Y (Draft — ...)</em></p>
// Extract those into a structured header (title + subtitle + meta).
function extractHeader(html) {
  const header = { title: null, subtitle: null, meta: null, isDraft: false }
  let rest = html

  const titleMatch = rest.match(/^\s*<p><strong>([^<]+)<\/strong><\/p>/i)
  if (titleMatch) {
    header.title = titleMatch[1].trim()
    rest = rest.slice(titleMatch[0].length)
  }

  const subtitleMatch = rest.match(/^\s*<p>([^<]+)<\/p>/i)
  if (subtitleMatch && !/^<strong>|^<em>/i.test(subtitleMatch[1])) {
    header.subtitle = subtitleMatch[1].trim()
    rest = rest.slice(subtitleMatch[0].length)
  }

  const metaMatch = rest.match(/^\s*<p><em>([^<]+)<\/em><\/p>/i)
  if (metaMatch) {
    header.meta = metaMatch[1].replace(/\s+/g, ' ').trim()
    header.isDraft = /draft/i.test(header.meta)
    rest = rest.slice(metaMatch[0].length)
  }

  return { header, body: rest }
}

function buildHeaderHtml(header) {
  const parts = [`<p class="disclosure-eyebrow">First Internet Bank · Jaris</p>`]
  if (header.isDraft) {
    parts.push(
      `<div class="draft-banner">DRAFT — pending Compliance &amp; Legal review.</div>`
    )
  }
  if (header.title) parts.push(`<h1>${header.title}</h1>`)
  if (header.subtitle) parts.push(`<p class="meta">${header.subtitle}</p>`)
  if (header.meta) parts.push(`<p class="meta">${header.meta}</p>`)
  return parts.join('\n')
}

function wrap({ title, bodyHtml }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link rel="stylesheet" href="/disclosures/disclosure.css" />
  </head>
  <body>
    <article class="disclosure">
${bodyHtml}
    </article>
  </body>
</html>
`
}

async function main() {
  await mkdir(outDir, { recursive: true })
  const entries = (await readdir(srcDir)).filter((f) => f.endsWith('.docx'))
  const manifest = []

  for (const file of entries) {
    const slug = resolveSlug(file)
    const buffer = await readFile(join(srcDir, file))
    const { value: rawHtml, messages } = await mammoth.convertToHtml({ buffer })

    const cleaned = stripLegalReviewTables(rawHtml)
    const { header, body } = extractHeader(cleaned)
    const fallbackTitle = header.title || basename(file, '.docx').replace(/\s+v\d+.*$/i, '')
    const headerHtml = buildHeaderHtml({ ...header, title: fallbackTitle })

    const outPath = join(outDir, `${slug}.html`)
    await writeFile(outPath, wrap({ title: fallbackTitle, bodyHtml: headerHtml + '\n' + body }))
    manifest.push({ slug, source: file, title: fallbackTitle, isDraft: header.isDraft })
    if (messages.length) {
      console.warn(`[${slug}] ${messages.length} conversion warning(s)`)
    }
    console.log(`✓ ${slug}.html  ←  ${file}`)
  }

  const manifestPath = join(outDir, 'manifest.json')
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(`\nWrote manifest → ${manifestPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
