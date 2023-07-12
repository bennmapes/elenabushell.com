/* eslint-disable no-unused-vars */

export interface CloudinaryAssets {
	[folder: string]: ImageFolder
}

export interface ImageFolder {
	[id: number]: ImageProps
}
export interface ImageProps {
  id: number
  index: number
  height: string
  width: string
  publicId: string
  format: string
  blurDataUrl?: string
  folderName: string
  folderId: string
}

export interface SharedModalProps {
  index: number
  images?: ImageProps[]
  currentPhoto?: ImageProps
  changePhotoIndex: (newVal: number) => void
  closeModal: () => void
  navigation: boolean
  direction?: number
}
