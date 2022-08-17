import './editor.scss';
import './style.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { PlainText, MediaUpload, MediaUploadCheck, InspectorControls } = wp.editor;
const { Button, PanelBody, PanelRow, ResponsiveWrapper } = wp.components;
const { withSelect } = wp.data;
const { Fragment } = wp.element;

const BlockEdit = ( props ) => {
	const { attributes, setAttributes } = props;

	return (
		<Fragment>

			<InspectorControls>
				<PanelBody
					title="Card Icon"
					initialOpen={ false }
				>
					<PanelRow>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( image ) => setAttributes( {
									imageId: image.id,
									imageUrl: image.url,
								} ) }
								value={ attributes.imageId }
								allowedTypes={ [ 'image' ] }
								render={ ( { open } ) => (
									<Button
										className={ attributes.imageId === 0 ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview' }
										onClick={ open }
									>
										{ attributes.imageId === 0 && __( 'Choose an image', 'awp' ) }
										{ props.media !== undefined &&
											<ResponsiveWrapper
												naturalWidth={ props.media.media_details.width }
												naturalHeight={ props.media.media_details.height }>
												<img src={ props.media.source_url } alt="icon" />
											</ResponsiveWrapper>
										}
									</Button>
								) }
							/>
						</MediaUploadCheck>
					</PanelRow>
					<PanelRow>
						{ attributes.mediaId !== 0 &&
							<MediaUploadCheck>
								<Button style={ { textAlign: 'center', display: 'block', width: '100%' } } onClick={ () => setAttributes( {
									imageId: 0,
									imageUrl: '',
								} ) } isLink isDestructive>{ __( 'Remove image', 'awp' ) }</Button>
							</MediaUploadCheck>
						}
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div className={ `${ props.className } cs-card` }>
				<div className="cs-card-body">
					<PlainText
						tagName="span"
						onChange={ ( content ) => setAttributes( { client_name: content } ) }
						value={ attributes.client_name }
						placeholder="Client Name"
					/>
					<PlainText
						tagName="h1"
						onChange={ ( content ) => setAttributes( { title: content } ) }
						value={ attributes.title }
						placeholder="Title"
					/>
					<PlainText
						tagName="p"
						onChange={ ( content ) => setAttributes( { description: content } ) }
						value={ attributes.description }
						placeholder="Description - Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
					/>
				</div>
			</div>
		</Fragment>
	);
};

registerBlockType( 'gb-geeky/case-study', {
	title: __( 'Case Study Card' ),
	icon: 'list-view', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'GB' ),
	],
	supports: {
		align: true,
	},
	attributes: {
		imageId: {
			type: 'number',
			default: 0,
		},
		imageUrl: {
			type: 'string',
			default: '',
		},
		client_name: {
			selector: 'span',
			source: 'html',
		},
		title: {
			selector: 'h1',
			source: 'html',
		},
		description: {
			selector: 'p',
			source: 'html',
		},
	},
	edit: withSelect( ( select, props ) => {
		return { media: props.attributes.imageId ? select( 'core' ).getMedia( props.attributes.imageId ) : undefined };
	} )( BlockEdit ),

	save: ( props ) => {
		return (
			<div className={ `${ props.className } cs-card-wrapper` }>
				<div className="cs-card-img-wrapper">
					<img src={ props.attributes.imageUrl } alt="" />
				</div>
				<div className="cs-card-text-wrapper">
					<span className="cs-client-name caption-text geeky-color-green">{ props.attributes.client_name }</span>
					<h4 className="cs-title geeky-color-black">{ props.attributes.title }</h4>
					<p className="cs-text geeky-color-black">{ props.attributes.description }</p>
					<a href="#" className="geeky-anchor-link-wrapper geeky-color-red">view project <i className="fas fa-arrow-right icon"></i></a>
				</div>
			</div>
		);
	},
} );
