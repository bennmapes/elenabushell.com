import { ImageProps } from './types';
import cloudinary from './cloudinary'
import getBase64ImageUrl from './generateBlurPlaceholder';
import { CloudinaryAssets } from './types';

let cachedResults: CloudinaryAssets

export default async function getResults() {
  if (!cachedResults) {
	const results = await cloudinary.v2.search
    .sort_by("filename", "asc")
    .max_results(500)
	.execute();

	let processedResults: CloudinaryAssets = {};
	let folderCount: {[folderId : string]: number} = {}
	let i = 0;
	for (let result of results.resources) {
		const folderId = getFolderId(result);
		const photoId = i;
		
		if (!processedResults[folderId]) {
			processedResults[folderId] = {};
		}
		if(folderCount[folderId] === undefined) {
			folderCount[folderId]=0;
		}
		const photoIndex = folderCount[folderId]++;
		processedResults[folderId][photoIndex] = {
			id: photoId,
			index: photoIndex,
			height: result.height,
			width: result.width,
			publicId: result.public_id,
			format: result.format,
			folderId,
			folderName: result.folder ?? "Uncatagorized"
		};
		i++;
	}
	const blurImagePromises: Promise<{
		blurUrl: string;
		folderId: string;
		photoId: string;
	}>[] = results.resources.map( async (image: any) => {
		const blurUrl = await getBase64ImageUrl(image);
		const folderId = getFolderId(image);
		const photoId = Object.keys(processedResults[folderId]).find(photoId => processedResults[folderId][photoId].publicId === image.public_id)
		return {
			folderId,
			blurUrl,
			photoId,
		}
	});

	const imagesWithBlurDataUrls =
		await Promise.all(blurImagePromises);

	for (let i = 0; i < imagesWithBlurDataUrls.length; i++) {
		const { blurUrl, folderId, photoId } = imagesWithBlurDataUrls[i];
		processedResults[folderId][photoId].blurDataUrl = blurUrl;
	}

    cachedResults = processedResults;
  }

  return cachedResults
}

export const getFolderId = (image: any): string => {
	let folderName: string = image.folder? image.folder : "Uncatagorized";
	folderName = folderName.replaceAll(" ", "-")
	return folderName;
}