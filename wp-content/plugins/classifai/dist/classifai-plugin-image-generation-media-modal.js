(() => {
    'use strict';

    (() => {
        const GeneratedImageModel = Backbone.Model.extend({
            defaults: {
                url: '',
            },
        });

        const getApiErrorMessage = (xhr) => {
            if (xhr?.responseJSON?.message) {
                return xhr.responseJSON.message;
            }

            if (xhr?.responseJSON?.data?.message) {
                return xhr.responseJSON.data.message;
            }

            if (xhr?.responseText) {
                try {
                    const parsed = JSON.parse(xhr.responseText);

                    if (parsed?.message) {
                        return parsed.message;
                    }

                    if (parsed?.data?.message) {
                        return parsed.data.message;
                    }
                } catch (error) {
                    // Ignore parse errors and fall back below.
                }
            }

            return xhr?.statusText || classifaiDalleData.errorText;
        };

        const ErrorView = wp.media.View.extend({
            el: '.error',
            initialize(options) {
                this.$el.text('');
                this.render(options.error);
            },
            render(error) {
                this.$el.text(error);
                return this;
            },
        });

        const GeneratedImages = Backbone.Collection.extend({
            model: GeneratedImageModel,
            url: wpApiSettings.root + classifaiDalleData.endpoint,
            makeRequest(prompt, quality, size, style, aspectRatio) {
                const requestData = {
                    format: 'b64_json',
                    prompt,
                };

                if (quality) {
                    requestData.quality = quality;
                }

                if (size) {
                    requestData.size = size;
                }

                if (style) {
                    requestData.style = style;
                }

                if (aspectRatio) {
                    requestData.aspect_ratio = aspectRatio;
                }

                this.fetch({
                    type: 'post',
                    beforeSend(request) {
                        request.setRequestHeader('X-WP-Nonce', wpApiSettings.nonce);
                    },
                    data: requestData,
                    reset: true,
                    error(collection, xhr) {
                        new ErrorView({
                            error: getApiErrorMessage(xhr),
                        });
                    },
                });
            },
        });

        const { uploadMedia } = window.wp.mediaUtils;
        const { cleanForSlug } = window.wp.url;

        const GeneratedImageView = wp.media.View.extend({
            tagName: 'li',
            template: wp.template('dalle-image'),
            events: {
                'click .button-import': 'import',
                'click .button-import-insert': 'importMediaLibrary',
                'click .button-media-library': 'loadMediaLibrary',
            },
            initialize(options) {
                this.data = this.model.toJSON();
                this.prompt = options.prompt;
                this.fileName = this.createSafeFilename(this.prompt);
            },
            render() {
                this.$el.html(this.template(this.data));
                return this;
            },
            createSafeFilename(prompt, maxLength = 80) {
                if (!prompt) {
                    return 'generated-image';
                }

                const safeFileName = cleanForSlug(prompt);

                if (safeFileName.length <= maxLength) {
                    return safeFileName;
                }

                const truncated = safeFileName.substring(0, maxLength);
                const lastDash = truncated.lastIndexOf('-');

                if (lastDash > maxLength * 0.5) {
                    return truncated.substring(0, lastDash);
                }

                return truncated;
            },
            async import() {
                this.enableLoadingState();

                const blob = await this.convertImageToBlob(this.data.url);

                if (blob) {
                    await uploadMedia({
                        filesList: [new File([blob], `${this.fileName}.png`)],
                        onFileChange: ([file]) => {
                            if (file && file.id) {
                                this.file = file;
                                this.$('.button-import')
                                    .removeClass('button-import')
                                    .addClass('button-media-library')
                                    .text(classifaiDalleData.buttonText);

                                this.$('.button-import-insert').remove();
                                this.disableLoadingState();
                            }
                        },
                        onError: (error) => {
                            this.disableLoadingState();
                            this.$('.error').text(error);
                        },
                        additionalData: {
                            post: wp.media.model.settings.post.id ?? 0,
                            caption: classifaiDalleData.caption,
                            alt_text: this.prompt,
                        },
                    });

                    return;
                }

                this.$('.error').text(classifaiDalleData.errorText);
            },
            async importMediaLibrary() {
                await this.import();
                await this.loadMediaLibrary();
            },
            async loadMediaLibrary() {
                this.enableLoadingState();

                const Attachment = wp.media.model.Attachment;
                this.attachment = await Attachment.get(this.file.id).fetch();

                const attr = {
                    file: this.attachment,
                    uploading: true,
                    date: new Date(),
                    filename: `${this.fileName}.png`,
                    menuOrder: 0,
                    loaded: 0,
                    percent: 0,
                    uploadedTo: wp.media.model.settings.post.id,
                };

                const attachment = wp.media.model.Attachment.create(attr);
                wp.Uploader.queue.add(attachment);

                _.each(['file', 'loaded', 'size', 'percent'], (key) => {
                    attachment.unset(key);
                });

                attachment.set(
                    _.extend(this.attachment, {
                        uploading: false,
                    }),
                );

                wp.media.model.Attachment.get(this.file.id, attachment);
                wp.Uploader.queue.reset();

                this.disableLoadingState();
                jQuery('#menu-item-browse').click();
            },
            enableLoadingState() {
                const buttons = this.$el.parent('ul').find('button');
                const spinner = this.$('.spinner');

                buttons.prop('disabled', true);
                spinner.addClass('active');
            },
            disableLoadingState() {
                const buttons = this.$el.parent('ul').find('button');
                const spinner = this.$('.spinner');

                buttons.prop('disabled', false);
                spinner.removeClass('active');
            },
            async convertImageToBlob(base64Image) {
                const image = new Image();
                image.src = `data:image/png;base64,${base64Image}`;
                image.crossOrigin = 'anonymous';

                await this.loadImage(image);

                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;

                const context = canvas.getContext('2d');

                if (!context) {
                    return null;
                }

                context.drawImage(image, 0, 0);

                return await new Promise((resolve) => {
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(blob);
                        }
                    }, 'image/jpeg');
                });
            },
            loadImage(image) {
                return new Promise((resolve) => {
                    image.onload = resolve;
                });
            },
        });

        const GeneratedImagesView = wp.media.View.extend({
            el: '.generated-images',
            initialize(options) {
                this.collection = new GeneratedImages();
                this.prompt = options.prompt;
                this.quality = options.quality;
                this.size = options.size;
                this.style = options.style;
                this.aspectRatio = options.aspectRatio;

                this.listenTo(this.collection, 'reset', this.renderAll);
                this.listenTo(this.collection, 'error', (collection, xhr) => {
                    this.error(getApiErrorMessage(xhr));
                });

                this.collection.makeRequest(this.prompt, this.quality, this.size, this.style, this.aspectRatio);
                this.render();
            },
            render() {
                this.$el.prev().find('button').prop('disabled', true);
                this.$el.prev().find('.error').text('');
                this.$('ul').empty();
                this.$('.spinner').addClass('active');
                this.$('.prompt-text').addClass('hidden');
                return this;
            },
            renderImage(model) {
                const imageView = new GeneratedImageView({
                    model,
                    prompt: this.prompt,
                });

                this.$('ul').append(imageView.render().el);
            },
            renderAll() {
                if (this.collection.length < 1) {
                    this.error(classifaiDalleData.errorText);
                    return;
                }

                this.$('.prompt-text').removeClass('hidden');
                this.$('.prompt-text span').text(this.prompt);
                this.$('.spinner').removeClass('active');
                this.collection.each(this.renderImage, this);
                this.$el.prev().find('button').prop('disabled', false);
            },
            error(message = '') {
                this.$('.spinner').removeClass('active');
                this.$el.prev().find('button').prop('disabled', false);

                if (message) {
                    this.$el.prev().find('.error').text(message);
                }
            },
        });

        const PromptView = wp.media.View.extend({
            template: wp.template('dalle-prompt'),
            events: {
                'click .button-generate': 'promptRequest',
                'keyup .prompt': 'promptRequest',
            },
            render() {
                this.$el.html(this.template());
                return this;
            },
            promptRequest(event) {
                let prompt = '';
                const parent = event.target.parentElement;

                if (event.which === 13) {
                    prompt = event.target.value.trim();
                } else if (event.target.nodeName === 'BUTTON') {
                    prompt = parent.querySelector('.prompt').value.trim();
                }

                const quality = parent?.querySelector('.quality')?.value.trim() || '';
                const size = parent?.querySelector('.size')?.value.trim() || '';
                const style = parent?.querySelector('.style')?.value.trim() || '';
                const aspectRatio = parent?.querySelector('.aspect-ratio')?.value.trim() || '';

                if (!prompt) {
                    return;
                }

                new GeneratedImagesView({
                    prompt,
                    quality,
                    size,
                    style,
                    aspectRatio,
                });
            },
        });

        const SelectFrame = wp.media.view.MediaFrame.Select;
        const PostFrame = wp.media.view.MediaFrame.Post;

        wp.media.view.MediaFrame.Select = SelectFrame.extend({
            bindHandlers() {
                SelectFrame.prototype.bindHandlers.apply(this, arguments);
                this.on('content:render:generate', this.generateContent, this);
            },
            browseRouter(routerView) {
                SelectFrame.prototype.browseRouter.apply(this, arguments);

                routerView.set({
                    generate: {
                        text: classifaiDalleData.tabText,
                        priority: 30,
                    },
                });
            },
            generateContent() {
                this.content.set(new PromptView().render());
            },
        });

        wp.media.view.MediaFrame.Post = PostFrame.extend({
            bindHandlers() {
                PostFrame.prototype.bindHandlers.apply(this, arguments);
                this.on('content:render:generate', this.generateContent, this);
            },
            browseRouter(routerView) {
                PostFrame.prototype.browseRouter.apply(this, arguments);

                routerView.set({
                    generate: {
                        text: classifaiDalleData.tabText,
                        priority: 30,
                    },
                });
            },
            generateContent() {
                this.content.set(new PromptView().render());
            },
        });
    })();

    (() => {
        const { Button } = window.wp.components;
        const { _nx } = window.wp.i18n;
        const { useBlockProps } = window.wp.blockEditor;
        const { jsx, jsxs, Fragment } = window.ReactJSXRuntime;

        const supportedBlocks = ['core/image', 'core/gallery', 'core/media-text', 'core/cover'];

        wp.hooks.addFilter('editor.MediaUpload', 'classifai/image-generation-link', (MediaUpload) => {
            return function WrappedMediaUpload(props) {
                const { render, ...mediaUploadProps } = props;
                let blockProps;

                try {
                    blockProps = useBlockProps();
                } catch (error) {
                    return jsx(MediaUpload, { ...props });
                }

                const { 'data-type': blockType } = blockProps;

                if (!supportedBlocks.includes(blockType)) {
                    return jsx(MediaUpload, { ...props });
                }

                let imageCount = 1;

                if (blockType && blockType === 'core/gallery') {
                    imageCount = Infinity;
                }

                return jsxs(Fragment, {
                    children: [
                        jsx(MediaUpload, {
                            ...mediaUploadProps,
                            mode: 'generate',
                            render: ({ open }) =>
                                jsx(Button, {
                                    variant: 'secondary',
                                    onClick: open,
                                    children: _nx('Generate image', 'Generate images', imageCount, 'Image or gallery upload', 'classifai'),
                                }),
                        }),
                        jsx(MediaUpload, { ...props }),
                    ],
                });
            };
        });
    })();
})();
