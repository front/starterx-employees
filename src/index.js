import { blocks, data, i18n } from 'wp';
import translations from './translations';

const { registerBlockType } = blocks;
const { dispatch, select } = data;
const { __, setLocaleData } = i18n;
const current_lang = document.documentElement.lang;

setLocaleData(translations[current_lang]);

// Import each block
import * as block1 from './employees';
import * as block2 from './employees/item';


// Category name and slug
const category = {
  slug: 'starterx',
  title: __('StarterX'),
};

// Register the new category and blocks
export function registerBlocks () {
  // Add the new category to the list
  const currentCategories = select('core/blocks').getCategories().filter(item => item.slug !== category.slug);
  dispatch('core/blocks').setCategories([ category, ...currentCategories ]);

  // Register each block
  registerBlockType(`${category.slug}/${block1.name}`, { category: category.slug, ...block1.settings });
  registerBlockType(`${category.slug}/${block2.name}`, { category: category.slug, ...block2.settings });
}

registerBlocks();
