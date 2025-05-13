(function ($, Drupal) {
  "use strict";

  Drupal.behaviors.fileValidation = {
    attach: function (context, settings) {
      const config = {
        allowedExtensions: ["jpg", "jpeg", "png", "pdf"],
        maxSizeMB: 100,
        messages: {
          required: "Debes subir una imagen",
          invalidFormat: (ext) => `Formato no permitido: .${ext}`,
          maxSize: (size) => `El archivo excede el límite de ${size}MB`,
        },
        selectors: {
          removeButton: '[data-drupal-selector^="edit-facturas-remove-button"]',
          fileInput: '[data-drupal-selector^="edit-facturas-upload"]',
          hiddenFids: '[data-drupal-selector="edit-facturas-fids"]',
          fileContainer: ".js-form-managed-file",
          customError: ".custom-error",
          ajaxWrapper: '[id^="ajax-wrapper"]',
        },
      };

      $(
        once(
          "fileValidation",
          "form#webform-submission-eventos-gatorade-add-form",
          context
        )
      ).each(function () {
        const $form = $(this);

        function getElements() {
          const elements = {
            $fileInput: $form.find(config.selectors.fileInput),
            $hiddenFids: $form.find(config.selectors.hiddenFids),
            $fileContainer: $form.find(config.selectors.fileContainer),
            $ajaxWrapper: $form.find(config.selectors.ajaxWrapper),
          };

          elements.$removeButton = elements.$fileContainer[0]?.querySelector(
            config.selectors.removeButton
          );

          return elements;
        }

        const observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            if (mutation.type === "childList") {
              const elements = getElements();
              const fileState = getFileState(elements);

              // Si hay un fid pero no hay botón de eliminar, significa que se eliminó el archivo
              if (fileState.hasHiddenFile && !elements.$removeButton) {
                resetFileInput(elements);
              }
            }
          });
        });

        const elements = getElements();
        if (elements.$ajaxWrapper.length) {
          observer.observe(elements.$ajaxWrapper[0], {
            childList: true,
            subtree: true,
          });
        }

        function resetFileInput(elements) {
          // Reiniciar el input file
          if (elements.$fileInput.length) {
            const $newFileInput = elements.$fileInput.clone(true);
            $newFileInput.val("");
            elements.$fileInput.replaceWith($newFileInput);
          }

          // Limpiar el hidden input de fids
          if (elements.$hiddenFids.length) {
            elements.$hiddenFids.val("");
          }

          // Asegurarse de que se muestre el wrapper de botones personalizado
          const $wrapper = elements.$fileContainer.find(".wrapper-custom-buttons");
          if (!$wrapper.length) {
            elements.$fileContainer.append(`
                <div class="wrapper-custom-buttons">
                  <div class="column-left">
                    <span class="icon icon-white-upload-file icon-xl"></span>
                    <p>Arrastra y suelta los archivos de video aquí</p>
                  </div>
                  <div class="column-right">
                    <button class="custom-button-upload-file">seleccionar archivos</button>
                    <p>También puedes buscar tu video</p>
                  </div>
                </div>
              `);
          }

          // Actualizar las clases del contenedor
          elements.$fileContainer
            .removeClass("load-file-custom")
            .addClass("no-file-custom");
        }

        $form.on("submit", function (e) {
          const elements = getElements();
          clearErrors(elements.$fileContainer);

          if (!validateFileSubmission(elements)) {
            e.preventDefault();
            return false;
          }
          return true;
        });

        $form.on("click", config.selectors.removeButton, function (e) {
          const elements = getElements();
          clearErrors(elements.$fileContainer);
        });

        $form.on("change", config.selectors.fileInput, function () {
          const elements = getElements();
          handleFileChange(this, elements);
        });

        function validateFileSubmission(elements) {
          const fileState = getFileState(elements);

          // Validar que haya un archivo (nuevo o existente)
          if (!fileState.hasNewFile && !fileState.hasHiddenFile) {
            showError(config.messages.required);
            return false;
          }

          // Si hay un archivo nuevo, validar formato y tamaño
          if (fileState.hasNewFile) {
            const file = elements.$fileInput.prop("files")[0];

            const extension = file.name.split(".").pop().toLowerCase();
            if (!config.allowedExtensions.includes(extension)) {
              showError(config.messages.invalidFormat(extension));
              return false;
            }

            if (file.size > config.maxSizeMB * 1024 * 1024) {
              showError(config.messages.maxSize(config.maxSizeMB));
              return false;
            }
          }

          return true;
        }

        function getFileState(elements) {
          return {
            hasNewFile:
              elements.$fileInput.length > 0 &&
              elements.$fileInput.prop("files").length > 0,
            hasHiddenFile:
              elements.$hiddenFids.length > 0 && elements.$hiddenFids.val() !== "",
            hasRemoveButton: !!elements.$removeButton,
          };
        }

        function handleFileChange(input, elements) {
          clearErrors(elements.$fileContainer);

          if (input.files.length > 0) {
            elements.$fileContainer
              .find(".wrapper-custom-buttons p")
              .first()
              .text(`Archivo seleccionado: ${input.files[0].name}`);
          }
        }

        function showError(message) {
          const elements = getElements();
          clearErrors(elements.$fileContainer);
          elements.$fileContainer
            .addClass("error-active")
            .after(`<strong class="custom-error error">${message}</strong>`);
        }

        function clearErrors($container) {
          $container.removeClass("error-active");
          $form.find(config.selectors.customError).remove();
        }
      });
    },
  };
})(jQuery, Drupal);
