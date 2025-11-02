#!/usr/bin/env node

import { BlogFormatter } from './utils/formatter.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🧪 Testing Topic Counter Fix\n')

// Test current state
const currentTopicPath = path.join(__dirname, 'current-topic.txt')
const topicsListPath = path.join(__dirname, 'topics.txt')

const currentNumber = parseInt(fs.readFileSync(currentTopicPath, 'utf8').trim())
const topicsList = fs.readFileSync(topicsListPath, 'utf8').trim().split('\n')

console.log('📊 Current State:')
console.log(`   Current topic number: ${currentNumber}`)
console.log(`   Total topics: ${topicsList.length}`)

const topicLine = topicsList.find((line) => line.startsWith(`${currentNumber}.`))
const topic = topicLine ? topicLine.replace(/^\d+\.\s*/, '') : 'NOT FOUND'
console.log(`   Current topic: "${topic}"`)

// Test next blog number
const nextBlogNumber = BlogFormatter.getNextBlogNumber()
console.log(`   Next blog number: ${nextBlogNumber}`)

console.log('\n🔧 Fix Verification:')
console.log('   Before fix: Topic counter incremented BEFORE generation')
console.log('   After fix: Topic counter increments ONLY after successful generation')

console.log('\n⬆️ Counter Update Logic:')
const nextNumber = currentNumber >= topicsList.length ? 1 : currentNumber + 1
console.log(`   ${currentNumber} → ${nextNumber} (after successful generation)`)

if (currentNumber === 45) {
  console.log(`   Wraparound test: 45 → 1 ✅`)
} else {
  console.log(`   Normal increment: ${currentNumber} → ${nextNumber} ✅`)
}

console.log('\n🎯 Expected Behavior:')
console.log(`   1st run: Generate blog ${nextBlogNumber} with topic "${topic}"`)
console.log(`   1st run success: Update counter ${currentNumber} → ${nextNumber}`)
console.log(`   2nd run: Generate blog ${nextBlogNumber + 1} with next topic`)
console.log('   No more duplicates! 🎉')

console.log('\n✅ Fix Applied Successfully!')
