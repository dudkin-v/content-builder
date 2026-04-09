import type { CBField } from '../core';
import { shared } from './shared';
import { collapsibleList } from './collapsibleList';
import { heroBanner } from './heroBanner';
import { heroSection } from './heroSection';
import { linkButtons } from './linkButtons';
import { textBlock } from './textBlock';
import { textSeparator } from './textSeparator';
import { simpleImagesCarousel } from './simpleImagesCarousel';
import { circleCardsCarousel } from './circleCardsCarousel';
import { threeTitledImages } from './threeTitledImages';
import { threeSimpleImages } from './threeSimpleImages';
import { imagesGrid } from './imagesGrid';
import { table } from './table';
import { steps } from './steps';
import { textWithImage } from './textWithImage';
import { titledImagesList } from './titledImagesList';
import { scrollingGallery } from './scrollingGallery';
import { defaultProductsCarousel } from './defaultProductsCarousel';
import { customProductsCarousel } from './customProductsCarousel';

export const COMPONENTS_REGISTRY: Record<string, CBField<any, any>> = {
    Advantages: shared.static,
    [textSeparator.name]: textSeparator,
    [linkButtons.name]: linkButtons,
    [collapsibleList.name]: collapsibleList,
    [heroBanner.name]: heroBanner,
    [heroSection.name]: heroSection,
    [simpleImagesCarousel.name]: simpleImagesCarousel,
    [circleCardsCarousel.name]: circleCardsCarousel,
    [threeTitledImages.name]: threeTitledImages,
    [threeSimpleImages.name]: threeSimpleImages,
    [imagesGrid.name]: imagesGrid,
    [table.name]: table,
    [steps.name]: steps,
    [scrollingGallery.name]: scrollingGallery,
    [textBlock.name]: textBlock,
    [textWithImage.name]: textWithImage,
    [titledImagesList.name]: titledImagesList,
    [defaultProductsCarousel.name]: defaultProductsCarousel,
    [customProductsCarousel.name]: customProductsCarousel,
};
