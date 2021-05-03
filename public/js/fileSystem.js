FilePond.registerPlugin (
    FilePondPluginImagePreview,
    FilePondPluginFileEncode,

    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize,

    // FilePondPluginFilePoster,

    // FilePondPluginImageEditor,

    // FilePondPluginImageEdit,
    // FilePondPluginImageResize,
)

FilePond.setOptions({
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
})

// FilePond.parse(document.body);
FilePond.create(document.querySelector('input[type="file"]'), {
    acceptedFileTypes: ['image/png',
                        'image/jpg',
                        'image/gif',
                        'image/jpeg'],
    maxFileSize: '8MB',
});