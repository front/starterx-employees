import React from 'react';
import { i18n, editor, components } from 'wp';

const { __ } = i18n;
const { RichText, BlockControls, MediaUpload } = editor;
const { Toolbar, IconButton } = components;


export function flattenText (arr) {
  let str = '';
  for(const token of arr) {
    if(typeof token === 'string') {
      str += token;
      continue;
    }
    str += flattenText(token.props.children);
  }
  return str;
}

export function getMediaAttrs (media) {
  if(media && media.data) {
    return Object.keys(media.data).reduce((d, key) => {
      d[`data-${key.toLowerCase().replace(/[^a-z0-9]/g, '-')}`] = media.data[key];
      return d;
    }, {});
  }
  return {};
}


// Editable block attributes
const BLOCK_ATTRIBUTES = {
  personName: {
    type: 'array',
    source: 'children',
    selector: '.employee__name',
    default: 'Person\'s Name',
  },
  jobTitle: {
    type: 'array',
    source: 'children',
    selector: '.employee__title',
    default: 'Job Title',
  },
  email: {
    type: 'array',
    source: 'children',
    selector: '.employee__email span',
    default: 'person@starterx.no',
  },
  phone: {
    type: 'array',
    source: 'children',
    selector: '.employee__phone span',
    default: '00 00 00 00',
  },
  image: {
    type: 'string',
    default: 'https://www.fillmurray.com/g/320/320',
  },
  imageData: {
    type: 'object',
    default: {},
  },
};


export const name = 'employees-item';

export const settings = {
  title: __('Employee'),
  description: __('A single person within an employees block.'),
  icon: 'columns',
  parent: ['starterx/employees'],
  attributes: BLOCK_ATTRIBUTES,

  edit ({ attributes, setAttributes }) {
    const { personName, jobTitle, email, phone, image, imageData } = attributes;
    const imgStyle = {
      backgroundImage: image && `url('${image}')`,
    };

    const onSelectImage = (media, field) => {
      setAttributes({
        [field]: media.url,
        [`${field}Data`]: getMediaAttrs(media),
      });
    };

    return (
      <div className="employee">
        <BlockControls>
          <Toolbar>
            <MediaUpload
              allowedTypes={ ['image'] }
              onSelect={ media => onSelectImage(media, 'image') } render={ ({ open }) => (
                <IconButton className="components-toolbar__control" label={ __('Edit image') }
                  icon="edit" onClick={ open } />
              ) }
            />
          </Toolbar>
        </BlockControls>
        <figure className="employee__image" style={ imgStyle }>
          <img src={ image } { ...imageData } />
        </figure>
        <div className="wrapper">
          <RichText
            tagName="h3" className="employee__name" value={ personName } placeholder="Person's Name"
            onChange={ value => setAttributes({ personName: value }) }
            formattingControls={ ['bold', 'italic'] }
          />
          <RichText
            tagName="p" className="employee__title" value={ jobTitle } placeholder="Job Title"
            onChange={ value => setAttributes({ jobTitle: value }) }
            formattingControls={ ['bold', 'italic'] }
          />
          <p className="employee__email">
            <strong>{ __('E-mail') }:</strong>
            <RichText
              tagName="span" value={ email } placeholder="person@startertheme.no"
              onChange={ value => setAttributes({ email: value }) } formattingControls={ [] }
            />
          </p>
          <p className="employee__phone">
            <strong>{ __('Phone') }:</strong>
            <RichText
              tagName="span" value={ phone } placeholder="00 00 00 00"
              onChange={ value => setAttributes({ phone: value }) } formattingControls={ [] }
            />
          </p>
        </div>
      </div>
    );
  },

  save ({ attributes }) {
    const { personName, jobTitle, email, phone, image, imageData } = attributes;
    const [ plainEmail, plainPhone ] = [email, phone].map(i => flattenText(i).replace(/\s/g, ''));

    const imgStyle = {
      backgroundImage: image && `url('${image}')`,
    };

    return (
      <div className="employee">
        <figure className="employee__image" style={ imgStyle }>
          <img alt="employee img" src={ image } { ...imageData } />
        </figure>
        <RichText.Content tagName="h3" className="employee__name" value={ personName } />
        <RichText.Content tagName="p" className="employee__title" value={ jobTitle } />
        <p className="employee__email">
          <strong>{ __('E-mail') }:</strong>
          <a href={ `mailto:${plainEmail}` }><RichText.Content tagName="span" value={ email } /></a>
        </p>
        <p className="employee__phone">
          <strong>{ __('Phone') }:</strong>
          <a href={ `tel:${plainPhone}` }><RichText.Content tagName="span" value={ phone } /></a>
        </p>
      </div>
    );
  },
};
