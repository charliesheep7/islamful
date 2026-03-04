import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import HaramChecker from './tools/HaramChecker'
import PrayerTimes from './tools/PrayerTimes'
import DuaCollection from './tools/DuaCollection'
import ToolsBox from './ToolsBox'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
  HaramChecker,
  PrayerTimes,
  DuaCollection,
  ToolsBox,
}
