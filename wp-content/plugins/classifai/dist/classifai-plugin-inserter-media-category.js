(() => {
    'use strict';

    const apiFetch = window.wp.apiFetch;
    const { subscribe, select, dispatch } = window.wp.data;
    const { __ } = window.wp.i18n;
    const { addQueryArgs } = window.wp.url;
    const { classifaiDalleData } = window;

    const waitForInserterOpen = async () =>
        new Promise((resolve) => {
            const unsubscribe = subscribe(() => {
                if (select('core/editor')?.isInserterOpened() || select('core/edit-widgets')?.isInserterOpened?.()) {
                    unsubscribe();
                    resolve();
                }
            });
        });

    const debounce = (fn, delay = 250) => {
        let timer;

        return (...args) => {
            clearTimeout(timer);

            return new Promise((resolve) => {
                timer = setTimeout(() => {
                    resolve(fn(...args));
                }, delay);
            });
        };
    };

    const fetchGeneratedImages = async ({ search = '' }) => {
        if (!search) {
            return [];
        }

        try {
            const response = await apiFetch({
                path: addQueryArgs(classifaiDalleData.endpoint, {
                    format: 'b64_json',
                }),
                method: 'POST',
                data: {
                    prompt: search,
                },
            });

            return response.map((item) => ({
                title: search,
                url: `data:image/png;base64,${item.url}`,
                previewUrl: `data:image/png;base64,${item.url}`,
                id: undefined,
                alt: search,
                caption: classifaiDalleData.caption,
            }));
        } catch (error) {
            return [];
        }
    };

    const getInserterMediaCategory = () => ({
        name: 'classifai-generate-image',
        labels: {
            name: classifaiDalleData.tabText,
            search_items: __('Enter a prompt', 'classifai'),
        },
        mediaType: 'image',
        fetch: debounce(fetchGeneratedImages, 2500),
        isExternalResource: true,
    });

    waitForInserterOpen().then(() => {
        dispatch('core/block-editor')?.registerInserterMediaCategory?.(getInserterMediaCategory());
    });
})();
