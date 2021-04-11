export const OPEN_SELECT_DIRECTORY_DIALOG_EVENT = 'open-select-directory-dialog'
export const SELECT_DIRECTORY_RESULT_EVENT = 'select-directory-result'
export const SCAN_FILE_INFO_EVENT = 'scan-file-info'
export const SCAN_FILE_INFO_RESULTS_EVENT = 'scan-file-info-results'

export declare interface FileInfo {
  path: string
}

export declare interface ScanFileResult {
  success: boolean,
  path: string,
  fileInfos: FileInfo[],
  errorMessage: string
}

export const SCAN_MARKDOWN_FRONT_MATTER_INFO_EVENT = 'scan-markdown-front-matter-info'
export const SCAN_MARKDOWN_FRONT_MATTER_INFO_RESULTS_EVENT = 'scan-markdown-front-matter-info-results'
