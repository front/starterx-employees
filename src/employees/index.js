import React from 'react';
import { i18n, editor } from 'wp';

import './style.scss';
import './editor.scss';

const { __ } = i18n;
const { InnerBlocks } = editor;


// Block Template
const ALLOWED_BLOCKS = ['starterx/employees-item'];
const TEMPLATE = [
  ['starterx/employees-item'],
];


export const name = 'employees';

export const settings = {
  title: __('Employees'),
  description: __('Grid with list of employees'),
  icon: 'businessman',
  attributes: {},

  edit ({ className }) {
    return (
      <div className={ className }>
        <InnerBlocks
          template={ TEMPLATE }
          templateLock={ false }
          allowedBlocks={ ALLOWED_BLOCKS }
        />
      </div>
    );
  },

  save () {
    return (
      <div className="container alignwide">
        <div className="row columns-4">
          <InnerBlocks.Content />
        </div>
      </div>
    );
  },
};
