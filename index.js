panel.plugin('rasteiner/ddupload', {
  use: [
    function(Vue) {
      const origComponent = Vue.component('k-block-type-image');
      const uploadComponent = Vue.component('k-upload');

      Vue.component("k-block-type-image", {
        computed: {
          uploadParams() {
            const field = this.$refs.orig.field('image');
            if(field) {
              return {
                accept: field.uploads.accept,
                max: 1,
                multiple: false,
                url: this.$urls.api + field.endpoints.field + "/upload",
              };
            }
            return {}
          },
        },
        render(h) {
          return h(
            "div",
            {
              on: {
                dragOver: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                },
                drop: (e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  const files = e.dataTransfer.files;
                  const images = Array.from(files).filter((file) =>
                    file.type.startsWith("image/")
                  );

                  if (images.length > 0) {
                    this.$refs.upload.drop([images[0]], this.uploadParams);
                  }
                },
              },
            },
            [
              h(origComponent, {
                ref: "orig",
                on: {
                  ...this.$listeners,
                },
                props: {
                  ...this.$props,
                },
                attrs: {
                  ...this.$attrs,
                },
              }),
              h(uploadComponent, {
                ref: "upload",
                on: {
                  success: (_, files) => {
                    this.$refs.orig.update({
                      location: 'kirby',
                      image: files
                    })
                  },
                },
              }),
            ]
          );
        },
      });
    }
  ]
});
