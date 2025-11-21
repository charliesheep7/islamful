import fs from 'fs'

/**
 * Parse JSONL file and return topic by number
 * @param {string} filePath - Path to JSONL file
 * @param {number} topicNumber - Topic number (1-indexed)
 * @returns {object} Topic object
 */
export function getTopicByNumber(filePath, topicNumber) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.trim().split('\n')

  for (const line of lines) {
    if (line.trim()) {
      const topic = JSON.parse(line)
      if (topic.number === topicNumber) {
        return topic
      }
    }
  }

  throw new Error(`Topic #${topicNumber} not found in ${filePath}`)
}

/**
 * Get total number of topics in JSONL file
 * @param {string} filePath - Path to JSONL file
 * @returns {number} Total topics
 */
export function getTotalTopics(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content
    .trim()
    .split('\n')
    .filter((line) => line.trim())
  return lines.length
}
