import { readFile, readFileSync, stat, statSync, writeFile, writeFileSync } from 'hexo-fs'
import { Stats } from 'graceful-fs'

/**
 * 获取文件内容和文件属性
 */
export class File {
  path: string

  constructor (path: string) {
    this.path = path
  }

  /**
   * 读取文件内容
   * @param options 读取选项
   */
  read (options?: { encoding?: string; flag?: string; escape?: boolean; }): Promise<string> {
    return readFile(this.path, options)
  }

  /**
   * 同步读取文件内容
   * @param options 读取选项
   */
  readSync (options?: { encoding?: string; flag?: string; escape?: boolean; }): string {
    return readFileSync(this.path, options)
  }

  /**
   * 获取文件属性
   */
  stat (): Promise<Stats> {
    return stat(this.path)
  }

  /**
   * 同步获取文件属性
   */
  statSync (): Stats {
    return statSync(this.path)
  }

  /**
   * 异步写入文件内容
   * @param data 文件内容
   */
  write (data: string): Promise<void> {
    return writeFile(this.path, data)
  }

  /**
   * 同步写入文件内容
   * @param data 文件内容
   */
  writeSync (data: string) {
    return writeFileSync(this.path, data)
  }
}
