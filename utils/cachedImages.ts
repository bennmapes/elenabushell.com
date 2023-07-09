import { ImageProps } from './types';
import cloudinary from './cloudinary'
import getBase64ImageUrl from './generateBlurPlaceholder';
import { CloudinaryAssets } from './types';

let cachedResults: CloudinaryAssets

export default async function getResults() {
  if (!cachedResults) {
	const results = await cloudinary.v2.search
    .sort_by("public_id", "desc")
    .max_results(500)
	.execute();

	let processedResults: CloudinaryAssets = {};
	let i = 0;
	for (let result of results.resources) {
		const folderId = getFolderId(result);
		const photoId = i;
		if (!processedResults[folderId]) {
			processedResults[folderId] = {};
		}
		processedResults[folderId][photoId] = {
			id: photoId,
			index: Object.keys(processedResults[folderId]).length,
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
		// console.log("Folder Id", folderId);
		// console.log(" Public ID", publicId);
		if(!processedResults[folderId][photoId]) {
			console.log(processedResults);
		}
		processedResults[folderId][photoId].blurDataUrl = blurUrl;
	}

    cachedResults = processedResults;
  }

  return cachedResults
}

const getFolderId = (image: any): string => {
	return encodeURIComponent(image.folder? image.folder : "Uncatagorized")
}