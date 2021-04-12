import { File } from '@/utils/file'
import { parse as yfm, split as syfm } from 'hexo-front-matter'
import { basename } from 'path'
import { toDate } from '@/utils/commons'
import _ from 'lodash'

const unMetaKeys = [
  'layout',
  'title',
  'date',
  'updated',
  'categories',
  'tags',
  'photos',
  '_content'
]

export interface PostFileInfo {
  path: string,
  fileName: string,
  type: 'json' | 'yaml' | 'none',
  modified: number,
  layout: string | undefined,
  title: string | undefined,
  date: string | undefined,
  updated: string | undefined,
  categories: Array<Array<string> | string> | undefined,
  tags: Array<Array<string> | string> | undefined,
  photos: Array<string> | undefined,
  meta: Map<string, any>
}

/**
 * 解析文件属性和frontMatter中的信息
 * @param path 文件路径
 */
export async function parsePost (path: string): Promise<PostFileInfo> {
  const file = new File(path)

  const postFileInfo: PostFileInfo = {
    path: path,
    fileName: basename(path),
    type: 'none',
    modified: 0,
    layout: undefined,
    title: undefined,
    date: undefined,
    updated: undefined,
    categories: undefined,
    tags: undefined,
    photos: undefined,
    meta: new Map<string, any>()
  }

  const [stats, content] = await Promise.all([file.stat(), file.read()])

  postFileInfo.modified = stats.mtimeMs

  // 解析front-matter的格式，none-没有头部，json-json格式，yaml-yaml格式
  const frontMatter = syfm(content)
  if (!frontMatter || !frontMatter.data) {
    postFileInfo.type = 'none'
  } else if (frontMatter.separator.startsWith(';')) {
    postFileInfo.type = 'json'
  } else {
    postFileInfo.type = 'yaml'
  }

  // 格式化各部件
  const data = yfm(content)

  postFileInfo.layout = data.layout
  postFileInfo.title = data.title

  data.date = toDate(data.date)
  postFileInfo.date = data.date
  data.updated = toDate(data.updated)
  postFileInfo.updated = data.updated

  if (data.category && !data.categories) {
    data.categories = data.category
    delete data.category
  }

  if (data.tag && !data.tags) {
    data.tags = data.tag
    delete data.tag
  }

  if (data.categories && !Array.isArray(data.categories)) {
    data.categories = [data.categories]
  }
  if (data.tags && !Array.isArray(data.tags)) {
    data.tags = [data.tags]
  }

  postFileInfo.categories = data.categories
  postFileInfo.tags = data.tags

  if (data.photo && !data.photos) {
    data.photos = data.photo
    delete data.photo
  }

  if (data.photos && !Array.isArray(data.photos)) {
    data.photos = [data.photos]
  }

  postFileInfo.photos = data.photos

  // 没有处理过的信息原样存储
  const metaMap = new Map<string, any>()
  for (const key of _.difference(_.keys(data), unMetaKeys)) {
    metaMap.set(key, data[key])
  }
  postFileInfo.meta = metaMap

  return postFileInfo
}
