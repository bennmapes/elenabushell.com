import { ImageFolder, ImageProps } from "./types"

export const imagesInFolder = (folder: ImageFolder): ImageProps[] => {
	return Object.values(folder)
}

export const imagePropsFromIndex = (folder: ImageFolder, photoIndex: number):ImageProps => {
	let testPhoto: ImageProps | undefined = undefined;
	for(const photo of imagesInFolder(folder)) {
		testPhoto = photo;
		if(photo.index === photoIndex) {
			return photo;
		}
	}
	throw new Error(`Unable to find photo index ${photoIndex} in folder ${testPhoto?.folderName}`)
}