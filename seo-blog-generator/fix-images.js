import fs from 'fs-extra'
import path from 'path'
import sharp from 'sharp'

const blogDir = '../public/images/blog'

async function fixImages() {
  try {
    // 1. Fix How to Pray Salah Guide
    const salahSlug = 'how-to-pray-salah-guide'
    const salahDir = path.join(blogDir, salahSlug)
    const testDir = path.join(blogDir, 'test-article-slug')

    await fs.ensureDir(salahDir)

    // Check if we should use the one from test-article-slug
    if (await fs.pathExists(path.join(testDir, 'hero.webp'))) {
      console.log('Found hero.webp in test-article-slug, moving to how-to-pray-salah-guide...')
      await fs.copy(path.join(testDir, 'hero.webp'), path.join(salahDir, 'hero.webp'))
      console.log('✅ Moved Salah image.')
    } else {
      console.log('⚠️  Could not find hero.webp in test-article-slug.')
    }

    // 2. Fix Al-Ruqyah
    const ruqyahSlug = 'al-ruqyah-al-shariyah-kamilah'
    const ruqyahDir = path.join(blogDir, ruqyahSlug)
    const ruqyahPng = path.join(ruqyahDir, 'hero.png')
    const ruqyahWebp = path.join(ruqyahDir, 'hero.webp')

    if (await fs.pathExists(ruqyahPng)) {
      console.log('Converting Al-Ruqyah image to webp...')
      await sharp(ruqyahPng).webp().toFile(ruqyahWebp)
      console.log('✅ Converted Al-Ruqyah image to webp.')
      // Optional: remove png? Let's keep it for now or remove it to be clean.
      await fs.remove(ruqyahPng)
    } else {
      console.log('⚠️  Could not find hero.png for Al-Ruqyah.')
    }
  } catch (error) {
    console.error('❌ Error fixing images:', error)
  }
}

fixImages()
