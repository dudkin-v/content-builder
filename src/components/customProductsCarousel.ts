import { z } from 'zod';
import { core, type InferData, type InferViewData } from '../core';
import { shared } from './shared';

const MIN_PRODUCTS_COUNT = 5;
const MAX_PRODUCTS_COUNT = 20;
const SKU_LENGTH = 9;

export const customProductsCarousel = core.component(
	{ name: 'Custom products carousel', hasResolver: true, optional: ['title', 'link'] },
	{
		title: shared.configurableText,
		link: shared.link,
		skus: core.extend(shared.string, {
			name: 'Custom products carousel skus',
			getInitialData: (data) => data || '',
			getNormalizedData: (data) => {
				if (data.length < MIN_PRODUCTS_COUNT * SKU_LENGTH) {
					return null;
				}

				if (data.length > MAX_PRODUCTS_COUNT * SKU_LENGTH) {
					return null;
				}

				const skus = new Set<string>();

				data.split(',').forEach((sku) => {
					const trimmed = sku.trim();

					if (
						trimmed.length !== SKU_LENGTH ||
						isNaN(Number(trimmed))
					) {
						return;
					}

					skus.add(trimmed);
				});

				if (
					skus.size < MIN_PRODUCTS_COUNT ||
					skus.size > MAX_PRODUCTS_COUNT
				) {
					return null;
				}

				return skus.values().toArray().join(',');
			},
			getValidationSchema: (context) => {
				return z
					.string()
					.trim()
					.regex(
						/^\d{9}(?:,\d{9})*$/,
						context.validationMessages?.incorrectValue
					)
					.refine(
						(value) => {
							const list = value.split(',');

							if (
								list.length < MIN_PRODUCTS_COUNT ||
								list.length > MAX_PRODUCTS_COUNT
							) {
								return false;
							}

							const unique = new Set(list);

							return unique.size === list.length;
						},
						{
							message: context.validationMessages?.arrayRange(
								MIN_PRODUCTS_COUNT,
								MAX_PRODUCTS_COUNT
							),
						}
					);
			},
		}),
	}
);

export type CustomProductsCarouselData = InferData<typeof customProductsCarousel>;
export type CustomProductsCarouselViewData = InferViewData<typeof customProductsCarousel>;
